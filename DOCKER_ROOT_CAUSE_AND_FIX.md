# CommerceMind AI — Docker Entrypoint Image Failure and Fix

## Executive status

The reported runtime failure is specific and reproducible at the image boundary:

```text
exec /usr/local/bin/entrypoint-backend: no such file or directory
exec /usr/local/bin/entrypoint-storefront: no such file or directory
```

The repository contains the source scripts at `docker/entrypoint-backend.sh` and `docker/entrypoint-storefront.sh`, but the previous Docker change did not provide a sufficiently observable build-time guarantee that the scripts were present in the final image. The previous image therefore could start with an `ENTRYPOINT` pointing at a path that was absent from the image filesystem.

The correction makes the image contract explicit in four ways. Each Dockerfile copies the script with an explicit `./docker/...` source path to the required extensionless runtime path, and also copies a `.sh` alias so the direct inspection path used during troubleshooting is valid. Each Dockerfile applies mode `755` and executes `test -f` and `test -x` during the image build. `.dockerignore` now explicitly re-includes the Docker directory and both scripts, and `.gitattributes` forces LF line endings for Docker shell scripts. The entrypoint files retain a valid `#!/bin/sh` interpreter.

This repository-side fix has passed static checks. Docker image construction and live Compose verification remain unverified in this sandbox because the Docker CLI is unavailable. No success claim is made for the runtime until the required image and container checks pass on a machine with Docker.

## Root cause and evidence

| Item | Evidence and interpretation |
|---|---|
| Observed failure | Both containers fail before application startup because their configured absolute entrypoint paths are absent from the image filesystem. |
| Previous source paths | The source scripts are present at `docker/entrypoint-backend.sh` and `docker/entrypoint-storefront.sh`. |
| Previous Dockerfile destinations | The prior Dockerfiles copied to `/usr/local/bin/entrypoint-backend` and `/usr/local/bin/entrypoint-storefront`, but did not provide a build-time file-presence assertion or the `.sh` inspection aliases. |
| Build context | Compose uses `context: .` for both services and selects `Dockerfile.backend` or `Dockerfile.storefront`. |
| Image tags | Compose now explicitly tags the built images as `commercemind-ai-backend:latest` and `commercemind-ai-storefront:latest`, matching the requested direct inspection commands. |
| Ignore rules | The original `.dockerignore` did not explicitly exclude `docker/`, but it also had no positive exceptions. Explicit exceptions are now present. |
| Current source state | Both scripts are tracked, executable, ASCII POSIX shell files with LF endings and `#!/bin/sh` as line 1. |
| Current build contract | The Dockerfiles now perform explicit `COPY`, `chmod 755`, `test -f`, and `test -x` steps for both runtime paths. |
| Data safety | PostgreSQL, Redis, and Ollama data volumes remain declared and untouched. No volume deletion or pruning command was added. |

The exact cause of the already-built image discrepancy cannot be proven from this sandbox because the failing image is not available here and Docker is not installed. The evidence is consistent with an image built from an older commit, an incorrect build context, a stale image/tag, or a build process that did not include the `docker/` source directory. The new build-time assertions will fail the build instead of allowing an image with a missing entrypoint to be tagged as usable.

## Corrected files

| File | Correction |
|---|---|
| `Dockerfile.backend` | Uses `COPY ./docker/entrypoint-backend.sh /usr/local/bin/entrypoint-backend`; copies `/usr/local/bin/entrypoint-backend.sh` as an inspection alias; applies mode `755`; asserts file existence and executability; retains the extensionless `ENTRYPOINT`. |
| `Dockerfile.storefront` | Uses the equivalent explicit storefront copy, alias, mode, and build-time assertions. |
| `.dockerignore` | Adds `!docker/`, `!docker/entrypoint-backend.sh`, and `!docker/entrypoint-storefront.sh`. |
| `.gitattributes` | Forces `docker/*.sh` to use LF line endings. |
| `docker/entrypoint-backend.sh` | Remains a POSIX `#!/bin/sh` executable and heals mounted dependencies before starting the backend. |
| `docker/entrypoint-storefront.sh` | Remains a POSIX `#!/bin/sh` executable and heals mounted dependencies before starting the storefront. |
| `DOCKER_ROOT_CAUSE_AND_FIX.md` | Records the missing-entrypoint image evidence and the new verification procedure. |

No Medusa core package, Medusa source file, business logic, PostgreSQL data volume, Redis data volume, or Ollama data volume was modified.

## Relevant Dockerfile contract

The backend image now contains the following build instructions:

```dockerfile
COPY ./docker/entrypoint-backend.sh /usr/local/bin/entrypoint-backend
COPY ./docker/entrypoint-backend.sh /usr/local/bin/entrypoint-backend.sh
RUN chmod 755 /usr/local/bin/entrypoint-backend /usr/local/bin/entrypoint-backend.sh \
    && test -f /usr/local/bin/entrypoint-backend \
    && test -x /usr/local/bin/entrypoint-backend
ENTRYPOINT ["/usr/local/bin/entrypoint-backend"]
```

The storefront image uses the same contract with `entrypoint-storefront`. The extensionless paths are the actual `ENTRYPOINT` targets. The `.sh` paths are intentionally retained as direct inspection aliases so both the runtime path and the source-name inspection path can be checked.

## Repository validations completed

The following checks passed in the sandbox:

```text
sh -n docker/entrypoint-backend.sh
sh -n docker/entrypoint-storefront.sh
test -f docker/entrypoint-backend.sh
test -f docker/entrypoint-storefront.sh
test -x docker/entrypoint-backend.sh
test -x docker/entrypoint-storefront.sh
CRLF checks for both scripts
Dockerfile COPY, chmod, test -f, and test -x assertions
.dockerignore positive exceptions
Git ignore checks for docker/ and both scripts
git diff --check
```

The source scripts were also confirmed as `POSIX shell script, ASCII text executable`, with the first line `#!/bin/sh`. Git reported all three relevant paths as not ignored. The static validation also confirmed that the Compose file still contains the PostgreSQL, Redis, and Ollama data volume mappings.

The Docker CLI check returned:

```text
DOCKER_CLI_UNAVAILABLE
```

Consequently, these operations were not executable in the sandbox:

```text
docker compose build --no-cache backend storefront
docker run --rm commercemind-ai-backend:latest ...
docker run --rm commercemind-ai-storefront:latest ...
docker compose up -d
docker compose ps
docker compose logs --tail=100 backend
docker compose logs --tail=100 storefront
```

## Required Docker verification on the user machine

Run these commands from the repository root on a machine with Docker Desktop running:

```powershell
docker compose down
docker compose build --no-cache backend storefront

docker run --rm commercemind-ai-backend:latest sh -lc "ls -l /usr/local/bin/entrypoint-backend && head -n 3 /usr/local/bin/entrypoint-backend && ls -l /usr/local/bin/entrypoint-backend.sh && head -n 3 /usr/local/bin/entrypoint-backend.sh"
docker run --rm commercemind-ai-storefront:latest sh -lc "ls -l /usr/local/bin/entrypoint-storefront && head -n 3 /usr/local/bin/entrypoint-storefront && ls -l /usr/local/bin/entrypoint-storefront.sh && head -n 3 /usr/local/bin/entrypoint-storefront.sh"
docker compose up -d
docker compose ps
docker compose logs --tail=100 backend
docker compose logs --tail=100 storefront
```

Because Compose now sets explicit `image:` names, the two image inspection commands target the exact images produced by `docker compose build`. They must show both extensionless runtime paths and `.sh` aliases. The `ls -l` output must include executable bits, and the first three lines must begin with `#!/bin/sh` followed by `set -eu`. The final `docker compose ps` output must show `backend` and `storefront` as `Up`; neither may be `Restarting`. PostgreSQL should remain healthy, and Redis and Ollama should be running.

These commands do not delete or prune `postgres_data`, `redis_data`, or `ollama_data`. Do not substitute them with `docker compose down -v`, `docker volume prune`, or any command that removes named volumes.

## Verification status

| Verification layer | Status |
|---|---|
| Repository source paths | Passed |
| Entrypoint interpreter and LF endings | Passed |
| Entrypoint executable source permissions | Passed |
| Dockerfile copy and build-time assertions | Passed by static inspection |
| `.dockerignore` and Git ignore behavior | Passed |
| Actual image filesystem | Not yet verified; Docker unavailable in sandbox |
| Backend container state | Not yet verified; Docker unavailable in sandbox |
| Storefront container state | Not yet verified; Docker unavailable in sandbox |

The fix must be considered **runtime-pending** until the image inspection and Compose checks above prove the files exist inside both images and both containers remain `Up` without restart loops.

## References

[1]: https://github.com/aminaayoub2710-lgtm/two "CommerceMind AI repository"
