<template>
  <div class="container-fluid mt-2">
    <div class="row">
      <div class="col sidebar">
        <div v-if="name">
          <avatar
            :username="name"
            :size="225"
            background-color="#E1E1E1"
            color="#000"
            :rounded="false"
            :src="avatarUrl"
          ></avatar>
          <div class="row p-1 mt-4">
            <small class="col-sm-12 text-info">Member Timezone:</small>
            <span class="col-sm-12">{{timezone}}</span>
          </div>
          <div class="row p-1">
            <small class="col-sm-12 text-info">Member Since:</small>
            <span
              class="col-sm-12"
            >{{createdAt | moment('timezone', timezone, "MMM Do YYYY / hh:ss a - z")}}</span>
          </div>
          <div class="row p-1">
            <small class="col-sm-12 text-info">Member Role:</small>
            <span class="col-sm-12">{{isAdmin ? 'Admin' : 'Member'}}</span>
          </div>
          <router-link
            :to="`/dashboard/members/${id}/edit`"
            class="btn btn-sm btn-block btn-info mt-3 mb-4"
          >
            <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i>Edit Member
          </router-link>
        </div>
        <div v-else>
          <div class="placeholderImg"></div>
        </div>
      </div>
      <div class="col infoSection" v-if="name">
        <h6 class="bg-secondary">Member Information</h6>
        <form>
          <div class="row">
            <div class="form-group col-sm-6">
              <label for="name">Name</label>
              <input
                id="name"
                type="text"
                class="form-control form-control-sm"
                v-model="name"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="email">Email</label>
              <input
                id="email"
                type="email"
                class="form-control form-control-sm"
                v-model="email"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="address1">Address 1</label>
              <input
                id="address1"
                type="text"
                class="form-control form-control-sm"
                v-model="address1"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="address2">Address 2</label>
              <input
                id="address2"
                type="text"
                class="form-control form-control-sm"
                v-model="address2"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="city">City</label>
              <input
                id="city"
                type="text"
                class="form-control form-control-sm"
                v-model="city"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="stateProv">State/Province</label>
              <input
                id="stateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="stateProv"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="country">Country</label>
              <input
                id="country"
                type="text"
                class="form-control form-control-sm"
                v-model="country"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="zipPostal">Zip/Postal Code</label>
              <input
                id="zipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="zipPostal"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="phone">Phone</label>
              <input
                id="phone"
                type="text"
                class="form-control form-control-sm"
                v-model="phone"
                readonly
              />
            </div>
          </div>
          <h6 class="mt-4 bg-secondary">Member Shipping Details</h6>
          <div class="row mb-4">
            <div class="form-group col-sm-6">
              <label for="shippingName">Shipping Name</label>
              <input
                id="shippingName"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.name"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingName">Shipping Email</label>
              <input
                id="shippingEmail"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.email"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingAddress1">Shipping Address 1</label>
              <input
                id="shippingAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.address1"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingAddress2">Shipping Address 2</label>
              <input
                id="shippingAddress2"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.address2"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingCity">Shipping City</label>
              <input
                id="shippingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.city"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingStateProv">Shipping State/Province</label>
              <input
                id="shippingStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.stateProv"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingCountry">Shipping Country</label>
              <input
                id="shippingCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.country"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingZipPostal">Shipping Zip/Postal Code</label>
              <input
                id="shippingZipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.zipPostal"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="shippingPhone">Shipping Phone</label>
              <input
                id="shippingPhone"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.phone"
                readonly
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from 'vue-avatar';

export default {
  name: 'MemberById',
  data() {
    return {
      id: undefined,
      avatarUrl: undefined,
      timezone: undefined,
      timezoneAbbrev: undefined,
      createdAt: undefined,
      isAdmin: false,
      name: '',
      email: undefined,
      address1: undefined,
      address2: undefined,
      city: undefined,
      stateProv: undefined,
      country: undefined,
      zipPostal: undefined,
      phone: undefined,
      shipping: undefined
    };
  },
  components: {
    Avatar
  },
  computed: {
    breadcrumbs: function() {
      return [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Members',
          link: '/dashboard/members'
        },
        {
          text: `${this.name}`,
          link: '#'
        }
      ];
    }
  },
  created: async function() {
    try {
      const res = await this.$store.dispatch('getMemberDetails', this.$route.params.id);
      const {
        _id,
        avatarUrl,
        timezone,
        timezoneAbbrev,
        createdAt,
        isAdmin,
        name,
        email,
        address1,
        address2,
        city,
        stateProv,
        country,
        zipPostal,
        phone,
        shipping
      } = res.data;

      this.id = _id;
      this.avatarUrl = avatarUrl ? avatarUrl : null;
      this.timezone = timezone;
      this.timezoneAbbrev = timezoneAbbrev;
      this.createdAt = createdAt;
      this.isAdmin = isAdmin;
      this.name = name;
      this.email = email;
      this.address1 = address1;
      this.address2 = address2;
      this.city = city;
      this.stateProv = stateProv;
      this.country = country;
      this.zipPostal = zipPostal;
      this.phone = phone;
      this.shipping = shipping;
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearMemberDetails');
  }
};
</script>

<style lang="scss" scoped>
.vue-avatar--wrapper {
  border-radius: 1rem !important;
}

.sidebar {
  flex: 0 0 255px;

  span {
    font-size: 0.8em;
  }

  .placeholderImg {
    border-radius: 1rem;
    background-color: white;
    width: 225px;
    height: 225px;
  }
}

.infoSection {
  .form-group {
    margin-top: 1px;
    margin-bottom: 1px;
  }

  h6 {
    color: white;
    padding: 0.5rem;
    border-radius: 4px;
  }
}

@media (max-width: 575px) {
  .sidebar {
    flex: none;
  }
}
</style>