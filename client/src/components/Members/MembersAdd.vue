<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link tag="a" class="btn btn-sm" to="/dashboard/members">Members</router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link tag="a" to="/dashboard/members/add" class="btn btn-sm">Add Member</router-link>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  computed: {}
};
</script>
