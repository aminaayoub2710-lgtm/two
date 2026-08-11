# CommerceMind AI

منصة تجارة إلكترونية مدعومة بالذكاء الاصطناعي، مبنية على **Medusa v2** و**Next.js**. يحافظ المشروع على Medusa كنواة تجارة خارجية غير معدّلة، ويضع كل الوظائف المخصصة داخل وحدات ومسارات وWorkflows وامتدادات Admin مستقلة وقابلة للترقية.

> **قاعدة أساسية:** لا يتم تعديل أي ملف داخل حزمة Medusa أو مستودع `medusajs/medusa`. جميع التخصيصات موجودة داخل `apps/backend/src` و`apps/storefront/src`.

## ما تم بناؤه

| المجال | التنفيذ |
|---|---|
| AI Gateway | أولوية لـ Ollama مع fallback إلى OpenAI وGemini وAnthropic وDeepSeek وOpenRouter |
| Business Intelligence | مؤشرات الإيرادات والطلبات وAOV ونسبة التنفيذ والإلغاءات واتجاه الإيرادات اليومية |
| AI Analysts | محلل المبيعات والمخزون وذكاء العملاء عبر Workflows مستقلة |
| Admin Extension | صفحة `/app/ai` تعرض KPIs ومخطط الإيرادات وملخصًا تنفيذيًا مولّدًا بالذكاء الاصطناعي |
| Storefront | هوية CommerceMind AI، Hero احترافي، SEO metadata، وتجربة Responsive فوق Medusa DTC Starter |
| Infrastructure | PostgreSQL وRedis وOllama وMedusa Backend وNext.js عبر Docker Compose |
| CI | فحص Build للـ backend وفحص TypeScript للـ storefront عبر GitHub Actions |

## التشغيل المحلي

المتطلبات هي Node.js 20 أو أحدث، وpnpm 10، وPostgreSQL. يمكن تشغيل Redis وOllama من خلال Compose.

```bash
cp .env.example .env
pnpm install
cp apps/backend/.env.template apps/backend/.env
```

اضبط `DATABASE_URL` و`JWT_SECRET` و`COOKIE_SECRET`، ثم أضف مفتاح مزود AI واحدًا على الأقل، أو شغّل Ollama محليًا. بعد ذلك شغّل الخدمتين:

```bash
pnpm --filter @dtc/backend dev
pnpm --filter @dtc/storefront dev
```

يتوفر الـ backend على `http://localhost:9000`، ولوحة Medusa على `http://localhost:9000/app`، والمتجر على `http://localhost:8000`. تظهر لوحة CommerceMind في `http://localhost:9000/app/ai` بعد إنشاء مستخدم Admin ومفتاح Publishable للمتجر.

## Docker Compose

```bash
docker compose up --build
```

ولتحميل نموذج Ollama محليًا:

```bash
docker compose exec ollama ollama pull llama3.2
```

لا تستخدم القيم الافتراضية الموجودة في `.env.example` في الإنتاج. يجب تمرير الأسرار من Secret Manager أو من بيئة النشر.

## بنية التخصيص

| Extension Point | الاستخدام |
|---|---|
| Custom Module | `apps/backend/src/modules/ai-gateway` لتوجيه مزودي الذكاء الاصطناعي |
| Workflow | عمليات التحليل التي يجب أن تمر عبر دورة Medusa الرسمية |
| Admin API Route | نقاط `/admin/ai/*` التي تقرأ بيانات التجارة فقط |
| Admin UI Route | صفحة `/app/ai` المضافة دون تعديل لوحة Medusa الأصلية |
| Storefront Components | عناصر الواجهة داخل `apps/storefront/src` |

للمزيد من التفاصيل، راجع [COMMERCEMIND.md](./COMMERCEMIND.md) و[توثيق Medusa للوحدات](https://docs.medusajs.com/learn/fundamentals/modules) و[توثيق API Routes](https://docs.medusajs.com/learn/fundamentals/api-routes) و[توثيق Admin UI Routes](https://docs.medusajs.com/learn/fundamentals/admin/ui-routes).

## التحقق

تم التحقق من backend بالأمر التالي:

```bash
pnpm --filter @dtc/backend build
```

وتم التحقق من TypeScript للـ storefront بالأمر التالي:

```bash
pnpm --filter @dtc/storefront exec tsc --noEmit
```

يتطلب `next build` الكامل وجود Medusa Backend متاحًا أثناء مرحلة جمع بيانات الصفحات الثابتة.
