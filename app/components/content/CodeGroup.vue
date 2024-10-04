<script setup lang="ts">
import CodeGroupTabsHeader from "./CodeGroupTabsHeader.vue";

function isTag(slot: any, tag: string) {
  return slot.type && slot.type.tag && slot.type.tag === tag;
}

function isCodeTag(slot: any) {
  return isTag(slot, "code-block") || isTag(slot, "code") || isTag(slot, "pre");
}

const activeTabIndex = ref(0);
const _slots = ref(useSlots()?.default || []);

const tabs = computed(() => {
  const slots = typeof _slots.value === "function" ? _slots.value() : [];
  return slots
    .filter((slot: any) => isCodeTag(slot))
    .map((slot: any, index: number) => {
      return {
        label: slot?.props?.filename || slot?.props?.label || `${index}`,
        language: slot?.props?.language || null,
        active: slot?.props?.active || false,
        component: slot,
      };
    });
});

function onChangeActiveTab(index: number) {
  activeTabIndex.value = index;
}

function render() {
  const slots = _slots.value?.() || [];
  return h(
    "div",
    {
      class: {
        "code-group": true,
        "first-tab": activeTabIndex.value === 0,
      },
    },
    [
      h(CodeGroupTabsHeader, {
        ref: "tabs-header",
        activeTabIndex: activeTabIndex.value,
        tabs: tabs.value,
        "onUpdate:activeTabIndex": onChangeActiveTab,
      }),
      h(
        "div",
        {
          class: "code-group-content",
          text: activeTabIndex.value,
        },
        // Map slots to content children
        slots.map((slot: any, index: number) => {
          if (slot.props && isCodeTag(slot)) slot.props.hideFilename = true;

          return h(
            "div",
            {
              // Current slot is displayed, others are hidden
              style: {
                display: index === activeTabIndex.value ? "block" : "none",
              },
              class: {
                "": !isCodeTag(slot),
              },
            },
            // Display direct children if not a ```code``` block
            [
              isCodeTag(slot)
                ? slot
                : h(
                    "div",
                    {
                      class: {
                        "preview-canvas": true,
                      },
                    },
                    [(slot.children as any)?.default?.() || h("div")]
                  ),
            ]
          );
        })
      ),
    ]
  );
}
</script>

<template>
  <render />
</template>

<style scoped lang="scss">
:deep(.container) {
  @apply rounded-t-none mb-0 mt-0;
}
:deep(.code-group-content) {
  @apply rounded-t-none;
}
</style>
