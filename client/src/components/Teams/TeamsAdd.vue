<template>
  <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link tag="a" class="btn btn-sm" to="/dashboard/teams">Teams</router-link>
      </li>
      <li class="breadcrumb-item">
        <router-link tag="a" to="/dashboard/teams/add" class="btn btn-sm">Add Team</router-link>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  name: 'TeamsAdd',
  computed: {}
};
</script>
