<template>
  <div class="container-fluid">
    <h4>Register</h4>
    <form @submit.prevent="register" class="m-auto" novalidate>
      <div class="input-field">
        <label for="email">Email Address</label>
        <input id="email" type="email" v-model="email" autofocus ref="email" />
      </div>
      <div class="input-field">
        <label for="password">Password</label>
        <input id="password" type="password" v-model="password" ref="password" />
      </div>
      <div class="input-field">
        <label for="name">Name</label>
        <input id="name" type="text" v-model="name" ref="name" />
      </div>
      <div class="input-field">
        <label for="address1">Address 1</label>
        <input id="address1" type="text" v-model="address1" ref="address1" />
      </div>
      <div class="input-field">
        <label for="address2">Address 2</label>
        <input id="address2" type="text" v-model="address2" ref="address2" />
      </div>
      <div class="input-field">
        <label for="city">City</label>
        <input id="city" type="text" v-model="city" ref="city" />
      </div>
      <div class="input-field">
        <label for="stateProv">State/Province</label>
        <input id="stateProv" type="text" v-model="stateProv" ref="stateProv" />
      </div>
      <div class="input-field">
        <label for="country">Country</label>
        <input id="country" type="text" v-model="country" ref="country" />
      </div>
      <div class="input-field">
        <label for="zipPostal">Zip/Postal</label>
        <input id="zipPostal" type="text" v-model="zipPostal" ref="zipPostal" />
      </div>
      <div class="input-field">
        <label for="phone">Phone</label>
        <input id="phone" type="text" v-model="phone" ref="phone" />
      </div>
      <div class="input-field">
        <label for="timezone">Timezone</label>
        <input id="timezone" type="text" v-model="timezone" ref="timezone" />
      </div>
      <label>
        <input
          type="checkbox"
          class="filled-in"
          checked="checked"
          id="shippingSame"
          v-model="shippingSame"
          ref="shippingSame"
        />
        <span>Use above details for shipping</span>
      </label>

      <div class="shippingDetails" v-if="!shippingSame">
        <h5>Shipping Details</h5>
        <div class="input-field">
          <label for="shippingName">Name</label>
          <input id="shippingName" type="text" v-model="shippingName" ref="shippingDetails" />
        </div>
        <div class="input-field">
          <label for="shippingAddress1">Address 1</label>
          <input
            id="shippingAddress1"
            type="text"
            v-model="shippingAddress1"
            ref="shippingAddress1"
          />
        </div>
        <div class="input-field">
          <label for="shippingAddress2">Address 2</label>
          <input
            id="shippingAddress2"
            type="text"
            v-model="shippingAddress2"
            ref="shippingAddress2"
          />
        </div>
        <div class="input-field">
          <label for="shippingCity">City</label>
          <input id="shippingCity" type="text" v-model="shippingCity" ref="shippingCity" />
        </div>
        <div class="input-field">
          <label for="shippingStateProv">State/Province</label>
          <input
            id="shippingStateProv"
            type="text"
            v-model="shippingStateProv"
            ref="shippingStateProv"
          />
        </div>
        <div class="input-field">
          <label for="shippingCountry">Country</label>
          <input id="shippingCountry" type="text" v-model="shippingCountry" ref="shippingCountry" />
        </div>
        <div class="input-field">
          <label for="shippingZipPostal">Zip/Postal</label>
          <input
            id="shippingZipPostal"
            type="text"
            v-model="shippingZipPostal"
            ref="shippingZipPostal"
          />
        </div>
        <div class="input-field">
          <label for="shippingPhone">Phone</label>
          <input id="shippingPhone" type="text" v-model="shippingPhone" ref="shippingPhone" />
        </div>
        <div class="input-field">
          <label for="shippingEmail">Email</label>
          <input id="shippingEmail" type="email" v-model="shippingEmail" ref="shippingEmail" />
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
        this.$toast.success(res.data[0].message);
        this.$router.push({ name: 'login' });
        this.$toast.success('Please log in');
      } catch (err) {
        if (err.response.data[0].context) {
          const key = err.response.data[0].context.key;
          this.$refs[key].focus();
        }
        this.$toast.error(err.response.data[0].message);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  width: 500px;
}

.alert-box {
  width: 500px;
  padding: 10px;
  background-color: #ef9a9a;
  border: 1px solid #f43336;
  border-radius: 10px;
}
</style>
