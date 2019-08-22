<template>
  <div class="container">
    <form @submit.prevent="register" novalidate>
      <div class="text-center mb-4">
        <img id="tbLogo" src="@/assets/tb_logo_white.svg" alt="Team Builder Logo" />
      </div>
      <h4 class="text-center mb-4">Register</h4>
      <div class="row form-group">
        <div class="col">
          <label for="email">Email address</label>
          <input
            type="email"
            class="form-control form-control-sm"
            id="email"
            ref="email"
            v-model="email"
            autofocus
          />
        </div>
        <div class="col">
          <label for="password">Password</label>
          <input
            type="password"
            class="form-control form-control-sm"
            id="password"
            ref="password"
            v-model="password"
          />
        </div>
      </div>

      <div class="form-group row">
        <div class="col-sm-12">
          <label for="name">Name</label>
          <input
            id="name"
            class="form-control form-control-sm"
            type="text"
            v-model="name"
            ref="name"
          />
        </div>
        <div class="col-sm-12">
          <label for="address1">Address 1</label>
          <input
            id="address1"
            class="form-control form-control-sm"
            type="text"
            v-model="address1"
            ref="address1"
          />
        </div>
        <div class="col-sm-12">
          <label for="address2">Address 2</label>
          <input
            id="address2"
            class="form-control form-control-sm"
            type="text"
            v-model="address2"
            ref="address2"
          />
        </div>
        <div class="col-sm-4">
          <label for="city">City</label>
          <input
            id="city"
            class="form-control form-control-sm"
            type="text"
            v-model="city"
            ref="city"
          />
        </div>
        <div class="col-sm-4">
          <label for="stateProv">State/Province</label>
          <input
            id="stateProv"
            class="form-control form-control-sm"
            type="text"
            v-model="stateProv"
            ref="stateProv"
          />
        </div>
        <div class="col-sm-4">
          <label for="country">Country</label>
          <input
            id="country"
            class="form-control form-control-sm"
            type="text"
            v-model="country"
            ref="country"
          />
        </div>
        <div class="col-sm-4">
          <label for="zipPostal">Zip/Postal</label>
          <input
            id="zipPostal"
            class="form-control form-control-sm"
            type="text"
            v-model="zipPostal"
            ref="zipPostal"
          />
        </div>
        <div class="col-sm-4">
          <label for="phone">Phone</label>
          <input
            id="phone"
            class="form-control form-control-sm"
            type="text"
            v-model="phone"
            ref="phone"
          />
        </div>
        <div class="col-sm-4">
          <label for="timezone">Timezone</label>
          <input
            id="timezone"
            class="form-control form-control-sm"
            type="text"
            v-model="timezone"
            ref="timezone"
            readonly
          />
        </div>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="checkbox" id="shippingSame" v-model="shippingSame" />
        <label class="form-check-label" for="shippingSame">Use same details for Shipping</label>
      </div>

      <div class="shippingDetails">
        <h5>Shipping Details</h5>
        <div class="form-group row">
          <div class="col-sm-12">
            <label for="shippingName">Name</label>
            <input
              id="shippingName"
              class="form-control form-control-sm"
              type="text"
              v-model="shippingName"
              ref="shippingName"
            />
          </div>
          <div class="col-sm-12">
            <label for="shippingAddress1">Address 1</label>
            <input
              id="shippingAddress1"
              class="form-control form-control-sm"
              type="text"
              v-model="shippingAddress1"
              ref="shippingAddress1"
            />
          </div>
          <div class="col-sm-12">
            <label for="shippingAddress2">Address 2</label>
            <input
              id="shippingAddress2"
              class="form-control form-control-sm"
              type="text"
              v-model="shippingAddress2"
              ref="shippingAddress2"
            />
          </div>
          <div class="col-sm-4">
            <label for="shippingCity">City</label>
            <input
              id="shippingCity"
              class="form-control form-control-sm"
              type="text"
              v-model="shippingCity"
              ref="shippingCity"
            />
          </div>
          <div class="col-sm-4">
            <label for="stateProv">State/Province</label>
            <input
              id="stateProv"
              class="form-control form-control-sm"
              type="text"
              v-model="stateProv"
              ref="stateProv"
            />
          </div>
          <div class="col-sm-4">
            <label for="country">Country</label>
            <input
              id="country"
              class="form-control form-control-sm"
              type="text"
              v-model="country"
              ref="country"
            />
          </div>
          <div class="col-sm-4">
            <label for="zipPostal">Zip/Postal</label>
            <input
              id="zipPostal"
              class="form-control form-control-sm"
              type="text"
              v-model="zipPostal"
              ref="zipPostal"
            />
          </div>
          <div class="col-sm-4">
            <label for="phone">Phone</label>
            <input
              id="phone"
              class="form-control form-control-sm"
              type="text"
              v-model="phone"
              ref="phone"
            />
          </div>
          <div class="col-sm-4">
            <label for="timezone">Timezone</label>
            <input
              id="timezone"
              class="form-control form-control-sm"
              type="text"
              v-model="timezone"
              ref="timezone"
              readonly
            />
          </div>
        </div>
      </div>
      <hr />
      <div>
        <button type="submit">Register</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      email: undefined,
      password: undefined,
      name: undefined,
      address1: undefined,
      address2: undefined,
      city: undefined,
      stateProv: undefined,
      country: undefined,
      zipPostal: undefined,
      phone: undefined,
      timezone: undefined,
      shippingSame: true,
      shippingName: undefined,
      shippingAddress1: undefined,
      shippingAddress2: undefined,
      shippingCity: undefined,
      shippingStateProv: undefined,
      shippingCountry: undefined,
      shippingZipPostal: undefined,
      shippingPhone: undefined,
      shippingEmail: undefined
    };
  },
  methods: {
    register: async function() {
      if (this.shippingSame) {
        this.shippingName = this.name;
        this.shippingAddress1 = this.address1;
        this.shippingAddress2 = this.address2;
        this.shippingCity = this.city;
        this.shippingStateProv = this.stateProv;
        this.shippingCountry = this.country;
        this.shippingZipPostal = this.zipPostal;
        this.shippingPhone = this.phone;
        this.shippingEmail = this.email;
      }

      const member = {
        email: this.email,
        password: this.password,
        name: this.name,
        address1: this.address1,
        address2: this.address2,
        city: this.city,
        stateProv: this.stateProv,
        country: this.country,
        zipPostal: this.zipPostal,
        phone: this.phone,
        timezone: this.timezone,
        shippingName: this.shippingName,
        shippingAddress1: this.shippingAddress1,
        shippingAddress2: this.shippingAddress2,
        shippingCity: this.shippingCity,
        shippingStateProv: this.shippingStateProv,
        shippingCountry: this.shippingCountry,
        shippingZipPostal: this.shippingZipPostal,
        shippingPhone: this.shippingPhone,
        shippingEmail: this.shippingEmail
      };

      try {
        const res = await this.$store.dispatch('register', member);
        this.$toasted.success(res.data[0].message);
        this.$router.push({ name: 'login' });
        this.$toasted.success('Please log in');
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toasted.error(err.response.data[0].message);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  margin-bottom: 100px;
  width: 600px;
  background-color: black;
  color: white;
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  font-weight: 200;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

label {
  font-size: 0.8rem;
  margin-bottom: 2px;
  margin-top: 4px;
}

.container {
  display: flex;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  justify-content: center;
}

#tbLogo {
  width: 150px;
}
</style>
