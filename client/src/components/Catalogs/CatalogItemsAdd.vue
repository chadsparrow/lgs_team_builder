<template>
  <div class="container">
    <div v-if="catalog && catalog._id">
      <form @submit.prevent="addCatalogItem" novalidate>
        <div class="row">
          <div class="form-group col-sm-12">
            <label for="name">Name</label>
            <input id="name" type="text" class="form-control" v-model="name" ref="name" />
          </div>
          <div class="form-group col-sm-6">
            <label for="productCode">ERP Product Code</label>
            <input
              id="productCode"
              type="text"
              class="form-control"
              v-model="productCode"
              ref="productCode"
            />
          </div>
          <div class="form-group col-sm-6">
            <label for="styleCode">Production Style Code</label>
            <input
              id="styleCode"
              type="text"
              class="form-control"
              v-model="styleCode"
              ref="styleCode"
            />
          </div>
          <div class="form-group col-sm-12 text-center my-3 sizesBox">
            <div class="mb-3">
              <label>Available Sizes</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                v-model="XXS"
                type="checkbox"
                id="size2XS"
                @change="setSizes"
              />
              <label class="form-check-label" for="size2XS">2XS</label>
            </div>
            <div class="form-check form-check-inline mx-3">
              <input
                class="form-check-input"
                v-model="XS"
                type="checkbox"
                id="sizeXS"
                @change="setSizes"
              />
              <label class="form-check-label" for="sizeXS">XS</label>
            </div>
            <div class="form-check form-check-inline mx-3">
              <input
                class="form-check-input"
                v-model="S"
                type="checkbox"
                id="sizeS"
                @change="setSizes"
              />
              <label class="form-check-label" for="sizeS">S</label>
            </div>
            <div class="form-check form-check-inline mx-3">
              <input
                class="form-check-input"
                v-model="M"
                type="checkbox"
                id="sizeM"
                @change="setSizes"
              />
              <label class="form-check-label" for="sizeM">M</label>
            </div>
            <div class="form-check form-check-inline mx-3">
              <input
                class="form-check-input"
                v-model="L"
                type="checkbox"
                id="sizeL"
                @change="setSizes"
              />
              <label class="form-check-label" for="sizeL">L</label>
            </div>
            <div class="form-check form-check-inline mx-3">
              <input
                class="form-check-input"
                v-model="XL"
                type="checkbox"
                id="sizeXL"
                @change="setSizes"
              />
              <label class="form-check-label" for="sizeXL">XL</label>
            </div>
            <div class="form-check form-check-inline mx-3">
              <input
                class="form-check-input"
                v-model="XXL"
                type="checkbox"
                id="size2XL"
                @change="setSizes"
              />
              <label class="form-check-label" for="size2XL">2XL</label>
            </div>
            <div class="form-check form-check-inline mx-3">
              <input
                class="form-check-input"
                v-model="XXXL"
                type="checkbox"
                id="size3XL"
                @change="setSizes"
              />
              <label class="form-check-label" for="size3XL">3XL</label>
            </div>
            <div class="form-check form-check-inline mx-3">
              <input
                class="form-check-input"
                v-model="XXXXL"
                type="checkbox"
                id="size4XL"
                @change="setSizes"
              />
              <label class="form-check-label" for="size4XL">4XL</label>
            </div>
          </div>
          <div class="form-group col-sm-4">
            <label for="gender">Gender</label>
            <select class="form-control form-control" id="gender" v-model="gender" ref="gender">
              <option value="M">Men's</option>
              <option value="W">Women's</option>
              <option value="U">Unisex</option>
              <option value="J">Junior</option>
            </select>
          </div>
          <div class="form-group col-sm-4">
            <label for="category">Category</label>
            <select
              class="form-control form-control"
              id="category"
              v-model="category"
              ref="category"
            >
              <option value="JERSEYS">Jerseys</option>
              <option value="JACKETS">Jackets</option>
              <option value="SHORTS">Shorts</option>
              <option value="ACCESSORIES">Accessories</option>
            </select>
            <small class="categoryHelp text-muted">Need list of categories - if necessary</small>
          </div>
          <div class="form-group col-sm-4">
            <label for="price">Price</label>
            <input
              type="number"
              id="price"
              ref="price"
              class="form-control"
              min="0"
              step="0.01"
              v-model="price"
            />
          </div>
          <div class="form-group col-sm-12">
            <label for="description">Description</label>
            <textarea
              id="description"
              ref="description"
              class="form-control"
              rows="10"
              v-model="description"
            ></textarea>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-sm-6">
            <button type="submit" class="btn btn-block btn-info">Add Catalog Item</button>
          </div>
          <div class="col-sm-6">
            <router-link
              tag="a"
              class="btn btn-danger btn-block"
              :to="`/dashboard/catalogs/${catalog._id}`"
            >Cancel</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CatalogItemsAdd',
  data() {
    return {
      name: '',
      productCode: '',
      styleCode: '',
      sizes: [],
      XXS: false,
      XS: false,
      S: false,
      M: false,
      L: false,
      XL: false,
      XXL: false,
      XXXL: false,
      XXXXL: false,
      price: 0.0,
      gender: '',
      description: '',
      category: '',
      images: [],
      isActive: true
    };
  },
  computed: {
    catalog: function() {
      return this.$store.getters.currentCatalog;
    }
  },
  created: async function() {
    try {
      await this.$store.dispatch('getCatalog', this.$route.params.id);
      const breadcrumbs = [
        { text: 'Dashboard', link: '/dashboard/index' },
        {
          text: 'Catalogs',
          link: '/dashboard/catalogs'
        },
        {
          text: `${this.catalog.brand} - ${this.catalog.season} - ${this.catalog.year}`,
          link: `/dashboard/catalogs/${this.catalog._id}`
        },
        {
          text: 'Add Item',
          link: '#'
        }
      ];
      await this.$store.dispatch('setBreadcrumbs', breadcrumbs);
    } catch (err) {
      this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
    }
  },
  methods: {
    setSizes: function() {
      const activeSizes = [];
      if (this.XXS) activeSizes.push('2XS');
      if (this.XS) activeSizes.push('XS');
      if (this.S) activeSizes.push('S');
      if (this.M) activeSizes.push('M');
      if (this.L) activeSizes.push('L');
      if (this.XL) activeSizes.push('XL');
      if (this.XXL) activeSizes.push('2XL');
      if (this.XXXL) activeSizes.push('3XL');
      if (this.XXXXL) activeSizes.push('4XL');

      this.sizes = activeSizes;
    },
    addCatalogItem: async function() {
      const newCatalogItem = {
        catalogId: this.catalog._id,
        name: this.name,
        productCode: this.productCode,
        styleCode: this.styleCode,
        sizes: this.sizes,
        price: this.price,
        gender: this.gender,
        description: this.description,
        category: this.category
      };
      try {
        const res = await this.$store.dispatch('addCatalogItem', newCatalogItem);
        this.$router
          .push({ name: 'catalogsById', params: { id: this.catalog._id } })
          .catch(() => {});
        this.$toasted.success(res.data[0].message, { icon: 'check-circle' });
      } catch (err) {
        this.$toasted.error(err.response.data[0].message, { icon: 'exclamation-triangle' });
        if (err.response.data[0].message === 'Product already exists.') {
          this.$refs['productCode'].value = '';
          this.$refs['styleCode'].value = '';
          this.$refs['productCode'].focus();
        } else {
          if (err.response.data[0].context.key !== 'sizes') {
            const key = err.response.data[0].context.key;
            this.$refs[key].focus();
          }
        }
      }
    }
  }
};
</script>
