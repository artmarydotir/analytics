<template>
  <ol class="breadcrumb">
    <li class="item">
      <nuxt-link :to="'/'" class="title"> Home </nuxt-link>
    </li>
    <li v-for="(item, i) in crumbs" :key="i" class="item">
      <nuxt-link :to="item.to" class="title">
        {{ item.title }}
      </nuxt-link>
    </li>
  </ol>
</template>
