<script setup lang="ts">
/**
 * パンくずリストコンポーネント
 * アクセシビリティに配慮した統一されたパンくずナビゲーション
 */

interface BreadcrumbItem {
  label: string
  to?: string
  icon?: string
  srLabel?: string // スクリーンリーダー用ラベル
  current?: boolean // 現在のページかどうか
}

interface Props {
  items: BreadcrumbItem[]
  variant?: 'default' | 'simple' // スタイルバリアント
  separator?: string // セパレータ文字（デフォルト: '&gt;'）
  class?: string // 追加のCSSクラス
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  separator: '&gt;',
  class: '',
})
</script>

<template>
  <nav
    :class="['breadcrumb', props.class]"
    aria-label="パンくずリスト"
  >
    <ol :class="variant === 'default' ? 'breadcrumb-list' : 'breadcrumb-simple-list'">
      <template v-for="(item, index) in items" :key="index">
        <li
          :class="variant === 'default' ? 'breadcrumb-item' : ''"
          :aria-current="item.current ? 'page' : undefined"
        >
          <!-- リンクがある場合 -->
          <NuxtLink
            v-if="item.to && !item.current"
            :to="item.to"
            :class="variant === 'default' ? 'breadcrumb-link' : ''"
          >
            <Icon v-if="item.icon" :name="item.icon" aria-hidden="true" class="breadcrumb-icon" />
            <span v-if="item.srLabel" class="visually-hidden">{{ item.srLabel }}</span>
            <template v-if="!item.srLabel">{{ item.label }}</template>
          </NuxtLink>

          <!-- 現在のページ（リンクなし） -->
          <span
            v-else
            :class="[
              variant === 'default' ? 'breadcrumb-current' : 'current-tag',
            ]"
          >
            {{ item.label }}
          </span>
        </li>

        <!-- セパレータ（最後の要素以外） -->
        <li
          v-if="index < items.length - 1"
          :class="variant === 'default' ? 'breadcrumb-separator' : 'separator'"
          aria-hidden="true"
          v-html="separator"
        />
      </template>
    </ol>
  </nav>
</template>

<style>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-simple-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-item {
  display: inline-flex;
  align-items: center;
}

.breadcrumb-separator {
  display: inline-flex;
  color: var(--color-gray-400);
}
</style>
