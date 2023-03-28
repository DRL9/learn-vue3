import { defineComponent, h, renderSlot } from "vue";
import type { TableColumnCtx } from "./store";
export default defineComponent({
  props: ["col", "row"],
  render() {
    const col: TableColumnCtx = this.$props.col;
    const row = this.$props.row;
    if (col.slots.default) {
      return renderSlot(col.slots, "default", { col, row });
    }
    return h("div", row[col.prop]);
  },
});
