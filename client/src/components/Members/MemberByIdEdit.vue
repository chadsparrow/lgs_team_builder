<template>
  <div>
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <router-link tag="a" class="btn btn-sm" to="/dashboard/members">Members</router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link class="btn btn-sm" tag="a" :to="`/dashboard/members/${id}`">
            {{
            name
            }}
          </router-link>
        </li>
        <li class="breadcrumb-item">
          <router-link class="btn btn-sm" tag="a" to="#">Edit</router-link>
        </li>
      </ol>
    </nav>
    <div class="row mt-4">
      <div class="col sidebar">
        <div class="row p-1">
          <small class="col-sm-12 text-info">Member Timezone:</small>
          <span class="col-sm-12">{{timezone}}</span>
        </div>
        <div class="row p-1">
          <small class="col-sm-12 text-info">Member Role:</small>
          <span class="col-sm-12">{{isAdmin ? 'Admin' : 'Member'}}</span>
        </div>
        <hr />
        <small class="text-info">Actions</small>
        <button
          class="btn btn-sm btn-block btn-dark mt-2"
          @click.prevent="updateMember"
        >Update Member</button>
        <router-link
          :to="`/dashboard/members/${id}`"
          class="btn btn-sm btn-block btn-danger mt-2"
          @click.prevent="updateMember"
        >Cancel</router-link>
        <hr />
        <button
          class="btn btn-sm btn-block btn-secondary mt-2"
          @click.prevent="toggleAdmin"
          v-if="!isAdmin"
        >Give Admin Status</button>
        <button
          class="btn btn-sm btn-block btn-secondary mt-2"
          @click.prevent="toggleAdmin"
          v-else
        >Revoke Admin Status</button>
        <button
          class="btn btn-sm btn-block btn-secondary mt-2 mb-4"
          @click.prevent="deleteMember"
        >Delete Member</button>
      </div>
      <div class="col infoSection">
        <div>
          <h6>Member Information</h6>
          <span class="badge badge-info">
            <small>Double click to edit</small>
          </span>
        </div>

        <form>
          <div class="row">
            <div class="form-group col-sm-6">
              <label for="name">Name</label>
              <input
                id="name"
                type="text"
                class="form-control form-control-sm"
                v-model="name"
                readonly="true"
                ondblclick="this.readOnly='';"
                onblur="this.readOnly='true';"
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
            <div class="form-group col-sm-12">
              <label for="address1">Address 1</label>
              <input
                id="address1"
                type="text"
                class="form-control form-control-sm"
                v-model="address1"
                readonly="true"
                ondblclick="this.readOnly='';"
                onblur="this.readOnly='true';"
              />
            </div>
            <div class="form-group col-sm-12" v-if="address2">
              <label for="address2">Address 2</label>
              <input
                id="address2"
                type="text"
                class="form-control form-control-sm"
                v-model="address2"
                readonly="true"
                ondblclick="this.readOnly='';"
                onblur="this.readOnly='true';"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="city">City</label>
              <input
                id="city"
                type="text"
                class="form-control form-control-sm"
                v-model="city"
                readonly="true"
                ondblclick="this.readOnly='';"
                onblur="this.readOnly='true';"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="stateProv">State/Province</label>
              <input
                id="stateProv"
                type="text"
                class="form-control form-control-sm"
                v-model="stateProv"
                readonly="true"
                ondblclick="this.readOnly='';"
                onblur="this.readOnly='true';"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="country">Country</label>
              <input
                id="country"
                type="text"
                class="form-control form-control-sm"
                v-model="country"
                readonly="true"
                ondblclick="this.readOnly='';"
                onblur="this.readOnly='true';"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="zipPostal">Zip/Postal Code</label>
              <input
                id="zipPostal"
                type="text"
                class="form-control form-control-sm"
                v-model="zipPostal"
                readonly="true"
                ondblclick="this.readOnly='';"
                onblur="this.readOnly='true';"
              />
            </div>
            <div class="form-group col-sm-6">
              <label for="phone">Phone</label>
              <input
                id="phone"
                type="text"
                class="form-control form-control-sm"
                v-model="phone"
                readonly="true"
                ondblclick="this.readOnly='';"
                onblur="this.readOnly='true';"
              />
            </div>
          </div>
          <h6 class="mt-4">Member Shipping Details</h6>
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
            <div class="form-group col-sm-12">
              <label for="shippingAddress1">Shipping Address 1</label>
              <input
                id="shippingAddress1"
                type="text"
                class="form-control form-control-sm"
                v-model="shipping.address1"
                readonly
              />
            </div>
            <div class="form-group col-sm-12" v-if="shipping.address2">
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
export default {
  name: 'MemberByIdEdit',
  data() {
    return {
      id: '',
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
      shipping: {}
    };
  },
  created: async function() {
    try {
      const res = await this.$store.dispatch('getMemberDetails', this.$route.params.id);
      const {
        _id,
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
    } catch (err) {
      this.$toasted.error(err.response.data[0].message);
    }
  },
  beforeDestroy: function() {
    this.$store.dispatch('clearMemberDetails');
  },
  methods: {
    deleteMember: async function() {
      try {
        if (confirm('Are you sure?')) {
          const res = await this.$store.dispatch('deleteMember', this.id);
          this.$toasted.success(res.data[0].message);
          this.$router.push({ name: 'members' });
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message);
      }
    },
    toggleAdmin: async function() {
      try {
        if (confirm('Are you sure?')) {
          const res = await this.$store.dispatch('toggleAdmin', this.id);
          this.$toasted.success(res.data[0].message);
          this.isAdmin = !this.isAdmin;
        }
      } catch (err) {
        this.$toasted.error(err.response.data[0].message);
      }
    }
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
}
.infoSection {
  label {
    font-size: 0.9rem;
    margin-bottom: 0px;
    margin-top: 4px;
    color: #999;
    margin-left: 4px;
  }

  .form-group {
    margin-top: 1px;
    margin-bottom: 1px;
  }

  h6 {
    background-color: #111;
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

