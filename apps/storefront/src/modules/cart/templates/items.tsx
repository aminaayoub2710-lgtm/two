import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@modules/common/components/ui"
import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import { getServerTranslator } from "@/i18n/server"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = async ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const { t } = await getServerTranslator()
  return (
    <div>
      <div className="pb-3 flex items-center"><Heading className="text-[2rem] leading-[2.75rem]">{t("cart.title")}</Heading></div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">{t("products.product")}</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>{t("cart.quantity")}</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">{t("cart.subtotal")}</Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">{t("cart.total")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items.sort((a, b) => ((a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1)).map((item) => <Item key={item.id} item={item} currencyCode={cart?.currency_code} />)
            : repeat(5).map((i) => <SkeletonLineItem key={i} />)}
        </Table.Body>
      </Table>
    </div>
  )
}

export default ItemsTemplate
