import { getCurrentInstance, ref, useSlots } from "vue";

import type { ComponentInternalInstance, Ref } from "vue";

interface Table extends ComponentInternalInstance {
  store: Store;
}

type Store = ReturnType<typeof useStore>;

interface TableColumnCtx {
  prop: string;
  label: string;
  id: string;
  slots: ReturnType<typeof useSlots>;
}

export type { Table, TableColumnCtx };

export function useStore() {
  const instance = getCurrentInstance() as Table;
  const states = {
    originColumns: ref([]) as Ref<TableColumnCtx[]>,
  };
  type State = typeof states;
  const mutations = {
    insertColumn(state: State, column: TableColumnCtx) {
      state.originColumns.value.push(column);
    },
    removeColumn(state: State, column: TableColumnCtx) {
      const idx = state.originColumns.value.findIndex(
        (a) => a.id === column.id
      );
      state.originColumns.value.splice(idx, 1);
    },
    sort(state: State) {
      state;
    },
  };
  const commit = (name: keyof typeof mutations, ...args: any[]) => {
    if (mutations[name]) {
      const _args = [instance.store.states, ...args];
      /** @ts-ignore-next-line */
      mutations[name].apply(instance, _args);
    }
  };
  return {
    mutations,
    states,
    commit,
  };
}
