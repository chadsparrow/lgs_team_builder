<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link tag="a" class="btn btn-sm btn-dark" to="/dashboard/catalogs">Catalogs</router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link tag="a" to="/dashboard/catalogs/add" class="btn btn-sm btn-light active">Add</router-link>
      </li>
      <router-link to="/dashboard/catalogs/" class="btn btn-sm btn-dark ml-auto">Cancel</router-link>
    </ol>
  </nav>
</template>

<script>
export default {
  computed: {}
};
</script>


