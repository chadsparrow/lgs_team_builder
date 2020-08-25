<template>
  <div class="page container"></div>
</template>

<script>
import toast from '../helpers/toast';

export default {
  name: 'Verify',
  created() {
    this.axios
      .get(`/api/v1/auth/verify?token=${this.$route.query.token}`)
      .then((res) => {
        toast.success('Account Verified - please login');
        this.$router.push({ path: '/' });
      })
      .catch((err) => {
        toast.error(err);
        this.$router.push({ path: '/' });
      });
  },
};
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  color: white;
  padding: 1rem;
  position: relative;

  #tbLogo {
    width: 150px;
    margin-bottom: 2rem;
  }

  .greeting {
    margin-bottom: 2rem;
  }

  form {
    width: 100%;
    max-width: 400px;

    input {
      text-align: center;
    }

    label {
      font-size: 0.85rem;
      line-height: 1rem;
      margin-left: 0.25rem;
      margin-bottom: 0.25rem;
    }

    button {
      margin: 2rem 0;
      font-weight: 700;
    }
  }
}
</style>
