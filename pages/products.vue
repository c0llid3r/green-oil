<template>
  <div class="content">
    <div class="feature-text chain-img">
      Welcome to our shop!
    </div>
    <br><br>
    <p>
    We use eco-friendly and reclaimed packaging material for all orders and aim to get your order to you within 3-5 working days.
    </p>
    <p>
    We don't send out confirmation emails in an effort to reduce our carbon footprint. However we are available on the phone and by email should you have any questions or queries.
    </p>

  <!-- <div id="product-search">
    <div>
      <div>
      <label>Product Type: </label>
        <select>
          <option name="allProducts">All Products</option>
          <option name="lubes">Lubes</option>
          <option name="grease">Greases</option>
        </select>
      </div>
      <div>
      <label>Keyword: </label>
        <input type="text" />
      </div>
    </div>
    <button class="search">Search</button>
  </div> -->
  <!-- PRODUCT CARDS -->
  <div class="products">
    <div v-for="product in products" :key="product.title" class="card">
        <!-- <div> -->
          <div class="title">
            {{ product.title }}
          </div>
          <div :class="product.descStyle">
            <div class="img">
              <img :src="product.image" :alt="product.title" />
            </div>
            <div class="details">
              <ul>
                <li v-for="description in product.desc" :key="description.index">{{ description }}</li>
              </ul>
            </div>
          </div>
        <!-- </div> -->
        <div class="card-section">
          <div class="price">
            <h1>
              {{ $store.state.currency[$store.state.currencySelect] }}{{ (product.price * $store.state.currencyConversion).toFixed(2) }}
            </h1>
          </div>
          <button @click="newForCart(product.title, product.price, product.image, product.id)" :name="product.title">Add To Cart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productDetails from '@/data/product-details.js'
import { mapActions, mapState } from 'vuex'

export default {
  data () {
    return {
      products: productDetails,
      currencySymbol: this.$store.state.currency
      // amount: product.price * $store.state.currencyConversion
    }
  },
  methods: {
    ...mapActions([
      'addToCart',
      'updateCartTotal',
      'checkFromCart'
    ]),
    newForCart (item, price, image, id) {
      const fullContents = { item, price, image, qty: 1, id }
      this.addToCart(fullContents)
    }
  },
  computed: {
    ...mapState([
      'currency',
      'cart',
      'counter'
    ])
  },
  head () {
    return {
      title: 'Green Oil Products',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { hid: 'description', name: 'description', content: 'About Green Oil' },
        { hid: 'keywords', name: 'keywords', content: 'bicycle, bike, oil, lube, eco, environment, eco-friendly, chain' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
  }

  h4 {
    color: rgb(105, 103, 103);
    font-size: 1.3rem;
  }

  #covid-update {
    background: rgba($background, 0.4);
    border-radius: 10px;
    padding: 2rem;
    width: 70%;
    margin: 0.5rem auto;
  }

  #product-search {
    width: 90%;
    padding: 1rem 2rem;
    margin: 1rem auto 0;
    background: rgba(21, 141, 41, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    div {
      max-width: 80%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;

      div {
        display: flex;
        align-items: center;
        justify-content: space-between;

        label {
          align-self: center;
          margin-right: 10px;
        }

        input {
          max-width: 80%;
        }
      }
    }

    &::before, &::after {
      position: absolute;
      content: '';
      border-bottom: 50px solid transparent;
      border-top: 50px solid transparent;
    }

    &::before {
      left: 0;
      border-left: 15px solid white;
      border-right: 15px solid transparent;
    }

    &::after {
      right: 0;
      border-left: 15px solid transparent;
      border-right: 15px solid white;
    }

    input, select {
      min-width: 180px;
      height: 2rem;
    }

    input {
      width: 250px;
    }

    .search {
      padding: 0.5rem 1rem;
    }

    button {
      margin: 1rem 0;
    }
  }

  .products {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1em;

    .card {
      width: 40ch;
      padding: 1rem;
      box-shadow: 0 0 10px 0 rgba(0,0,0,0.25);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;

      .title {
        font-size: 2rem;
        margin-bottom: 1em;
        height: 4rem;
      }

      .card-section, .card-section-wide {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0.5em 0;
        width: 100%;

        &:last-child {
          width: 70%;
          justify-self: flex-end;
        }

        .img {
          width: 90%;
          img {
            max-height: 20ch;
            max-width: 90%;
          }
        }

        .details {
          ul {
            max-width: 35ch;
            min-height: 15ch;
            text-align: center;
            padding: 0 1em;
            li {
              list-style: none;
              font-size: 1em;

              &:nth-child(2n) {
                color: black;
              }
            }
          }
        }

        button {
          padding: 1rem 1.5rem;
          color: white;
          background: $button-bg-color;
          border: none;
          border-radius: 6px;
          box-shadow: 0 5px 5px 0 rgba(37, 37, 37, 0.5);
        }
      }
}

  #product-search {
    max-width: 95%;
    margin: 1rem auto 0;
    padding: 1rem 1rem 0 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;

    &::before, &::after {
      border: none;
    }

    div {
      flex-direction: column;
      div {
        input {
          width: 90%;
        }
      }
    }
  }

}

@media screen and (max-width: 1000px) {
  .products .card {
    width: 95%;
    .card-section, .card-section-wide {
      flex-direction: row;
      justify-content: center;
      * {
        margin: 0 1em;
      }
      .img {
        max-width: 45%;
        img {
          max-width: 90%;
        }
      }

      .details ul {
        max-width: 40ch;
        padding: 0;
        li {
          font-size: 1.2em;
        }
      }
    }
    .card-section-wide {
      flex-direction: column;
      .img {
        max-width: 80%;
        img {
          max-width: 80%;
        }
      }
    }
    .card-section:last-child {
      flex-direction: column;
    }
  }
}

</style>
