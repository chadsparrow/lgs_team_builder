<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col sidebar-left">
        <div v-if="name">
          <avatar
            :username="name"
            :size="225"
            background-color="#FFF"
            color="#000"
            :rounded="false"
            :src="avatarUrl"
          ></avatar>
          <div class="row p-1 mt-4">
            <small class="col-sm-12 text-info">Member Timezone:</small>
            <span class="col-sm-12">{{ timezone }}</span>
          </div>
          <div class="row p-1">
            <small class="col-sm-12 text-info">Member Since:</small>
            <span class="col-sm-12">
              {{
              createdAt | moment('timezone', timezone, 'MMM Do YYYY / hh:mm a - z')
              }}
            </span>
          </div>
          <div class="row p-1">
            <small class="col-sm-12 text-info">Member Role:</small>
            <span class="col-sm-12">{{ isAdmin ? 'Admin' : 'Member' }}</span>
          </div>
          <div v-if="teams && teams.length > 0">
            <small class="text-info ml-1 mb-2">Member of Teams:</small>
            <ul class="list-group">
              <li
                class="list-group-item list-group-item-action"
                v-for="team of teams"
                :key="team._id"
                @click.prevent="loadTeam(team._id)"
              >{{ team.name }}</li>
            </ul>
          </div>
        </div>
        <div v-else>
          <div class="placeholderImg"></div>
        </div>
      </div>
      <div class="col middle-section" v-if="name">
        <form class="mb-4">
          <div class="section-header mb-2 bg-secondary">
            <span class="text-white">Contact Info</span>
          </div>
          <div class="row mb-3">
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
            <div class="form-group col-sm-4">
              <label for="city">City</label>
              <input
                id="city"
                type="text"
                class="form-control form-control-sm"
                v-model="city"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="stateProv">State/Province</label>
              <input
                id="stateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="stateProv"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
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
          <div class="section-header my-2 bg-secondary">
            <span class="text-white">Billing Details</span>
          </div>
          <div class="row mb-3">
            <div class="form-group col-sm-6">
              <label for="billingName">Billing Name</label>
              <input
                id="billingName"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.name"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="billingName">Billing Email</label>
              <input
                id="billingEmail"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.email"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="billingAddress1">Billing Address 1</label>
              <input
                id="billingAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.address1"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="billingAddress2">Billing Address 2</label>
              <input
                id="billingAddress2"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.address2"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="billingCity">Billing City</label>
              <input
                id="billingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.city"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="billingStateProv">Billing State/Province</label>
              <input
                id="billingStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.stateProv"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="billingCountry">Billing Country</label>
              <input
                id="billingCountry"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.country"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="billingZipPostal">Billing Zip/Postal Code</label>
              <input
                id="billingZipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.zipPostal"
                readonly
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="billingPhone">Billing Phone</label>
              <input
                id="billingPhone"
                type="text"
                class="form-control form-control-sm"
                v-model="billing.phone"
                readonly
              />
            </div>
          </div>
          <div class="section-header my-2 bg-secondary">
            <span class="text-white">Shipping Details</span>
          </div>
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
            <div class="form-group col-sm-4">
              <label for="shippingCity">Shipping City</label>
              <input
                id="shippingCity"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.city"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
              <label for="shippingStateProv">Shipping State/Province</label>
              <input
                id="shippingStateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.stateProv"
                readonly
              />
            </div>
            <div class="form-group col-sm-4">
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
          <router-link :to="`/dashboard/members/${id}/edit`" class="btn btn-block btn-info mt-2">
            <i class="fas fa-cog mr-2" style="vertical-align: middle;"></i>Edit Member Details
          </router-link>
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
      id: '',
      avatarUrl: '',
      timezone: '',
      timezoneAbbrev: '',
      createdAt: '',
      isAdmin: false,
      name: '',
      email: '',
      address1: '',
      address2: '',
      city: '',
      stateProv: '',
      country: '',
      zipPostal: '',
      phone: '',
      shipping: {},
      billing: {},
      teams: []
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
        shipping,
        billing
      } = res.data.member;

      this.teams = res.data.teams;

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
      this.billing = billing;
      await this.$store.dispatch('setBreadcrumbs', this.breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  methods: {
    loadTeam: function(id) {
      this.$router.push({ name: 'teamsById', params: { id } }).catch(() => {});
    }
  }
};
</script>
