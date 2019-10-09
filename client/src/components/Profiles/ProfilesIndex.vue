<template>
  <div class="page">
    <div class="sidebar-left" v-if="memberDetails && memberDetails._id">
      <div class="avatarWrapper">
        <Gravatar :email="memberDetails.email" default-img="mp" :size="255" />
        <a
          href="https://gravatar.com"
          target="_blank"
          class="btn btn-sm btn-block btn-info mt-1"
        >Update your Gravatar</a>
      </div>
      <div class="row p-1 mt-3">
        <small class="col-sm-12 text-info">My Timezone:</small>
        <span class="col-sm-12">{{ memberDetails.timezone }}</span>
      </div>
      <div class="row p-1">
        <small class="col-sm-12 text-info">Member Since:</small>
        <span class="col-sm-12">
          {{
          memberDetails.createdAt
          | moment('timezone', memberDetails.timezone, 'MMM Do YYYY - hh:mm a - z')
          }}
        </span>
      </div>
      <router-link :to="`/dashboard/profile/edit`" class="btn btn-sm btn-block btn-info mt-3 mb-2">
        <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i>Edit My Profile
      </router-link>
      <router-link :to="`/dashboard/profile/password`" class="btn btn-sm btn-block btn-danger mb-2">
        <i class="fas fa-lock mr-2" style="vertical-align: middle;"></i>Change Password
      </router-link>
      <router-link :to="`/dashboard/profile/email`" class="btn btn-sm btn-block btn-danger">
        <i class="fas fa-envelope mr-2" style="vertical-align: middle;"></i>Update Email Address
      </router-link>
    </div>
    <div class="middle-section" v-if="memberDetails && memberDetails._id">
      <div class="row">
        <div class="contactSection col-sm-4">
          <div class="section-header bg-secondary">
            <span class="text-white">Contact</span>
          </div>
          <div class="row info-spans">
            <div class="col-sm-12 mb-1">
              <label class="text-info">Name</label>
              <br />
              <span>{{ memberDetails.name }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Email</label>
              <br />
              <span>{{ memberDetails.email }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Address1</label>
              <br />
              <span>{{ memberDetails.address1 }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Address 2</label>
              <br />
              <span>{{ memberDetails.address2 || '--' }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">City</label>
              <br />
              <span>{{ memberDetails.city }}</span>
            </div>
            <div class="col-sm-6 mb-1">
              <label class="text-info">State/Province</label>
              <br />
              <span>{{ memberDetails.stateProv }}</span>
            </div>
            <div class="col-sm-6 mb-1">
              <label class="text-info">Country</label>
              <br />
              <span>{{ memberDetails.country }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Zip/Postal Code</label>
              <br />
              <span>{{ memberDetails.zipPostal }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Phone</label>
              <br />
              <span>{{ memberDetails.phone }}</span>
            </div>
          </div>
        </div>
        <div class="billingSection col-sm-4">
          <div class="section-header bg-secondary">
            <span class="text-white">Billing</span>
          </div>
          <div class="row info-spans">
            <div class="col-sm-12 mb-1">
              <label class="text-info">Name</label>
              <br />
              <span>{{ memberDetails.billing.name }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Email</label>
              <br />
              <span>{{ memberDetails.billing.email }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Address1</label>
              <br />
              <span>{{ memberDetails.billing.address1 }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Address 2</label>
              <br />
              <span>{{ memberDetails.billing.address2 || '--' }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">City</label>
              <br />
              <span>{{ memberDetails.billing.city }}</span>
            </div>
            <div class="col-sm-6 mb-1">
              <label class="text-info">State/Province</label>
              <br />
              <span>{{ memberDetails.billing.stateProv }}</span>
            </div>
            <div class="col-sm-6 mb-1">
              <label class="text-info">Country</label>
              <br />
              <span>{{ memberDetails.billing.country }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Zip/Postal Code</label>
              <br />
              <span>{{ memberDetails.billing.zipPostal }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Phone</label>
              <br />
              <span>{{ memberDetails.billing.phone }}</span>
            </div>
          </div>
        </div>
        <div class="shippingSection col-sm-4">
          <div class="section-header bg-secondary">
            <span class="text-white">Shipping</span>
          </div>
          <div class="row info-spans">
            <div class="col-sm-12 mb-1">
              <label class="text-info">Name</label>
              <br />
              <span>{{ memberDetails.shipping.name }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Email</label>
              <br />
              <span>{{ memberDetails.shipping.email }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Address1</label>
              <br />
              <span>{{ memberDetails.shipping.address1 }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Address 2</label>
              <br />
              <span>{{ memberDetails.shipping.address2 || '--' }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">City</label>
              <br />
              <span>{{ memberDetails.shipping.city }}</span>
            </div>
            <div class="col-sm-6 mb-1">
              <label class="text-info">State/Province</label>
              <br />
              <span>{{ memberDetails.shipping.stateProv }}</span>
            </div>
            <div class="col-sm-6 mb-1">
              <label class="text-info">Country</label>
              <br />
              <span>{{ memberDetails.shipping.country }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Zip/Postal Code</label>
              <br />
              <span>{{ memberDetails.shipping.zipPostal }}</span>
            </div>
            <div class="col-sm-12 mb-1">
              <label class="text-info">Phone</label>
              <br />
              <span>{{ memberDetails.shipping.phone }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Gravatar from 'vue-gravatar';

export default {
  name: 'ProfilesIndex',
  components: {
    Gravatar
  },
  computed: {
    member: function() {
      return this.$store.getters.getCurrentMember;
    }
  },
  data() {
    return {
      memberDetails: {}
    };
  },
  created: async function() {
    try {
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'My Profile',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
      const res = await this.$store.dispatch('getMemberDetails', this.member._id);
      this.memberDetails = res.data.member;
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  display: grid;
  grid-template-columns: 255px 1fr;
  grid-template-rows: 1fr;
  grid-gap: 1rem;
  width: 100%;
  height: 100%;
  grid-template-areas: 'sidebar-left middle-section';
}
</style>

