<template>
  <div class="wrap">
    <div class="container">
      <PageHeader />
      <div class="main-content">
        <Nuxt />
      </div>
      <Footer />
      <div v-bind:class="{'shoppingCart':true, 'shoppingCartVisible':(viewCart)}">
        <div class="cart-header">
          <h2>Your Cart</h2>
        </div>
        <div v-if="$store.state.cart.total > 0" class="cart-contents">
        <ul>
          <li v-for="item in this.$store.state.cart.items" :key="item.item">
              <div class="item-summary">
                <div>
                  <img :src="item.image" :alt="item.item"/>
                </div>
                <div>
                  <p class="cart-item-description">{{item.item}}</p>
                  <p>{{ $store.state.currency[$store.state.currencySelect] }}{{ (item.price * $store.state.currencyConversion).toFixed(2) }}</p>
                </div>
              </div>
              <div>
                <img src="@/assets/ICONS/increment.png" @click="increaseItemQty(item)"/>
                <p>{{item.qty}}</p>
                <img src="@/assets/ICONS/decrement.png" @click="decreaseItemQty(item)"/>
              </div>
          </li>
        </ul>
        </div>
        <div v-if="paidFor" class="cart-contents">
          <h3><br><br>Thank you. Your payment has been processed.</h3>
        </div>
        <div v-if="$store.state.cart.total <= 0" class="cart-contents">
          <h3><br><br>Your cart is empty.</h3>
        </div>
        <p id="cartTotal">Total: {{ $store.state.currency[$store.state.currencySelect] }}{{(this.$store.state.cart.total * $store.state.currencyConversion).toFixed(2)}}</p>

        <!-- PAYPAL FUNCTIONALITY APPEARS HERE -->
        <div class="paypal-buttons">
          <div ref="paypal"></div>
        </div>

        <!-- <form target="paypal" action="https://www.paypal.com/cgi-bin/webscr" method="post">
          <input type="hidden" name="cmd" value="_xclick">
          <input type="hidden" name="business" value="collidernix@gmail.com">
          <input type="hidden" name="item_name" value="Green Oil Order">
          <input type="hidden" name="currency_code" :value="this.$store.state.currencies[this.$store.state.currencySelect]">
          <input type="hidden" name="amount" :value="(cart.total * $store.state.currencyConversion).toFixed(2)">
          <input type="submit" name="submit" class="addToCart" value="Checkout">
          <img alt="" border="0" src="https://www.paypalobjects.com/en_GB/i/scr/pixel.gif" width="1" height="1">
        </form> -->
        <div id="close-cart" @click="closeCart()"><img src="../assets/ICONS/shopping-cart-icon-open.png" /></div>
      </div>
    </div>
    <div class="cart-actions">
      <div :class="{'cartButton':true, 'cartButtonMove':(viewCart)}" @click="showCart()"></div>
      <div class="cartItems" v-if="this.$store.state.cart.items.length > 0 && !viewCart"><span>{{this.cartQty()}}</span></div>
      <div class="cartItems-mobile">Cart total: {{this.$store.state.cart.total}}</div>
      <div v-if="!viewCart" class="currencyButton" @click="changeCurrency()">
        <div>
          <!-- <img :src="require(`@/assets/ICONS/${this.$store.state.currencies[this.$store.state.currencySelect]}.jpeg`)" /> -->
          {{ $store.state.currency[$store.state.currencySelect] }}
        </div>
      </div>
    </div>

    <!-- IF PAYMENT BOX TO APPEAR SEPERATELY IN CENTRE OF SCREEN -->
    <!-- <div class="payment-dialog">
        <div ref="paypal"></div>
    </div> -->
  </div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import Footer from '@/components/Footer.vue'
import { mapActions, mapState } from 'vuex'

export default {
  components: {
    PageHeader,
    Footer
  },
  data () {
    return {
      viewCart: false,
      loaded: false,
      paidFor: false,
      resetCart: false
    }
  },
  methods: {
    ...mapActions([
      'addToCart',
      'updateCart',
      'increaseQty',
      'decreaseQty',
      'updateCurrency',
      'clearCart'
    ]),
    changeCurrency () {
      this.updateCurrency()
    },
    async sync () {
      const _cart = JSON.stringify(this.cart.items)
      await localStorage.setItem(this.cart.key, _cart)
    },
    init () {
      const _items = localStorage.getItem(this.$store.state.cart.key)
      this.paidFor = _items && false
      this.updateCart(_items)
    },
    increaseItemQty (item) {
      this.increaseQty(item)
    },
    decreaseItemQty (item) {
      this.decreaseQty(item)
    },
    showCart () {
      this.init()
      this.viewCart = !this.viewCart
    },
    closeCart () {
      this.viewCart = !this.viewCart
    },
    cartQty () {
      let total = 0
      for (let i = 0; i < this.$store.state.cart.items.length; i++) {
        total += this.$store.state.cart.items[i].qty
      }
      return total
    },
    makePayment () {
      const script = document.createElement('script')
      script.src = 'https://www.paypal.com/sdk/js?client-id=AZ1OU1dqwYBJ_gHhYS7KkgJA81KXyFWqU1EEr0Y7g3hv8F3CA23vN3C4XTJ3eQlzQ37_SYVqYzbipUOR&currency=GBP'
      script.addEventListener('load', this.setLoaded)
      document.body.appendChild(script)
    },
    setLoaded () {
      this.loaded = true
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: 'Green Oil order',
                  amount: {
                    currency_code: 'GBP',
                    value: (this.$store.state.cart.total * this.$store.state.currencyConversion).toFixed(2)
                  }
                }
              ]
            })
          },
          onApprove: async (data, actions) => {
            const order = await actions.order.capture()
            console.log(order)
            this.paidFor = true
            this.resetCart = true
            this.clearCart()
          },
          onError: (err) => {
            console.log(err)
          }
        })
        .render(this.$refs.paypal)
    }
  },
  computed: {
    ...mapState([
      'currency',
      'cart'
    ])
  },
  mounted () {
    this.init()
    this.makePayment()
  }
}
</script>

<style lang="scss">

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Fira Sans Extra Condensed', sans-serif;
  color: $normal-font;
  line-height: 1.5;

  p {
    margin: 0 auto;
    max-width: 80ch;
  }
}

.iframe-container {
  position: relative;
  height: 0;
  padding-bottom: 56.25%;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.cartItems-mobile {
  display: none;
}

.wrap {
  margin: 0 calc(5vw - 30px) 0 5vw;
  display: flex;
  justify-content: center;
}

.container {
  min-height: 100vh;
  width: 95%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  text-align: center;
  box-shadow: 0 0 4px 0 black;
  background: $banner-bg;
}

.main-content {
  width: 100%;
  padding: 1rem 1rem 4rem;
  background: white;
  overflow: hidden;
}

.feature-text {
  font-size: 1.8em;
  line-height: 1.1;
  margin: 1em auto 0.5em;
  max-width: 40ch;
  color: $titles-color;
  font-family: 'Special Elite', cursive;
}

.cartButton {
  visibility: visible;
  position: sticky;
  width: 40px;
  height: 40px;
  top: 9rem;
  background: rgba($button-bg-color, 0.7);
  background-image: url('../assets/ICONS/shopping-cart-icon.png');
  background-size: 95%;
  background-position-y: center;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  cursor: pointer;

  &:hover {
    background: rgba($background, 0.3);
    background-image: url('../assets/ICONS/shopping-cart-icon.png');
    background-size: 95%;
    background-position-y: center;
  }
}

.cartButtonMove {
  visibility: hidden;
  top: 1.5rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  background: none;
  background-image: url('../assets/ICONS/shopping-cart-icon-open.png');
  background-size: 95%;
  background-position-y: center;
  z-index: 21;

  &:hover {
    background: none;
    background-image: url('../assets/ICONS/shopping-cart-icon-open.png');
    background-size: 95%;
    background-position-y: center;
  }
}

.cartItems {
  position: sticky;
  width: 26px;
  height: 26px;
  top: 7rem;
  margin-left: 6px;
  color: white;
  font-size: 1rem;
  border-radius: 50%;
  background: rgba($titles-color, 1);
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.currencyButton {
  position: sticky;
  width: 32px;
  height: 32px;
  top: 12rem;
  margin-left: 3px;
  font-size: 1.1em;
  border-radius: 50%;
  border: 2px solid black;
  transition: all 600ms ease-in-out;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  div img {
    max-width: 75%;
    margin: 0 auto;
  }
}

.shoppingCart {
  position: fixed;
  left: 100%;
  top: 0px;
  bottom: 0px;
  width: 400px;
  background: rgba(233, 233, 233, 0.95);
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  transition: all 600ms ease-in-out;
  padding: 2rem 0;
  overflow-y: scroll;
  z-index: 20;

  #close-cart {
    position: absolute;
    visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
    margin: 1.5rem 2.5rem 0 0;
    cursor: pointer;
  }

  ul {
    width: 100%;
    margin: 2rem auto 0;
    list-style: none;

    li {
      width: 100%;
      padding: 0.5rem;
      display: flex;
      justify-content: space-between;
      font-size: 1.2em;
      margin-bottom: 0.5rem;
      min-height: 85px;

      &:nth-child(2n + 1) {
        background: rgba(255,255,255,0.4);
      }
      &:nth-child(2n) {
        background: rgba(0,0,0,0.03);
      }

      .item-summary {
        display: flex;
        // align-items: flex-start;
        // justify-content: center;

        img {
          margin-top: 5px;
          width: 50px;
        }

        div:nth-child(2) {

        p {
          text-align: left;
          font-size: 0.9em;
        }
      }
      }

      & > div:last-child {
        width: 10%;
        font-size: 0.9em;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        img {
          max-width: 80%;
        }

        p {
          height: 20px;
          width: 20px;
          font-size: 0.8em;
          color: white;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
        }
      }
        img {
          cursor: pointer;
        }
    }
  }

  #cartTotal {
    width: 85%;
    font-size: 1.5rem;
    text-align: right;
    margin: 1rem 0 2rem;
    padding: 0 2rem;
  }

  .addToCart {
    margin: 3rem 0;
    padding: 0.5rem 1rem;
    color: white;
    background: $button-bg-color;
    border: none;
    border-radius: 6px;
    box-shadow: 0 5px 5px 0 rgba(37, 37, 37, 0.5);
    cursor: pointer;
  }
}

.cart-header {
  width: 100%;
  font-size: 1.3rem;
  padding-bottom: 1rem;
}

.cart-contents {
  font-size: 1rem;
  max-width: 80%;
  height: 70%;
  overflow-y: hidden;
  justify-self: flex-start;
  &:hover {
    margin-left: 20px;
    max-width: calc(80% + 20px);
    overflow-y: scroll;
  }
}

.shoppingCartVisible {
  left: calc(100vw - 400px);
  box-shadow: 0 0 45px 35px rgba(0,0,0,0.5);

  #close-cart {
    position: absolute;
    visibility: visible;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    right: 40px;
    width: 40px;
    height: 40px;
    margin: 1.5rem 0 0 0;
    cursor: pointer;
    transition: all 600ms ease;

    img {
      max-width: 100%;
    }
  }
}

// IF PAYMENT BOX TO APPEAR SEPERATELY IN CENTRE OF SCREEN
// .payment-dialog {
//   position: fixed;
//   width: 450px;
//   height: 600px;
//   top: 50vh;
//   left: 50vw;
//   transform: translate(-50%, -50%);
//   margin: auto;
//   background: rgba(176, 182, 176, 0.9);
//   padding: 60px 30px 30px;
//   display: flex;
//   justify-content: center;
//   align-items: flex-start;
//   overflow-y: scroll;
//   opacity: 0;
// }

.show-payment-box {
  opacity: 1;
}

.paypal-buttons {
  padding: 0 2rem;
}

@media screen and (max-width: 800px) {

  .wrap {
    margin: 0;
    width: 100vw;
  }

  .container {
    display: flex;
    flex-direction: column;
    min-width: 300px;
    width: 100%;
    margin: 0;
    box-shadow: none;
  }

  .cart-actions {
    position: fixed;
    display: flex;
    justify-content: space-around;
    background: rgba(255,255,255,0.9);
    box-shadow: 0 0 15px 0 rgba(0,0,0,0.5);
    padding: 0.5rem 0;
    bottom: 0;
    left: 0;
    width: 100vw;

    .cartButton {
      border-radius: 50%;
      width: 36px;
      height: 36px;
      // background: transparent;
      // background-image: url('../assets/ICONS/shopping-cart-icon.png');
      background: url('../assets/ICONS/shopping-cart-icon-mobile.png');
      background-size: 90%;
      background-position: center center;
      border: 2px solid black;
    }

    // .cartButtonMove {
    //   color: black;
    //   background-image: url('../assets/ICONS/shopping-cart-icon-open.png');
    //   background-size: 95%;
    //   background-position-y: center;
    //   z-index: 21;
    //   transition: all 1200ms ease-out;

    //   &:hover {
    //     background: none;
    //     background-image: url('../assets/ICONS/shopping-cart-icon-open.png');
    //     background-size: 95%;
    //     background-position-y: center;
    //   }
    // }

    .cartItems {
      display: none;
    }

    .cartItems-mobile {
      display: block;
      align-self: center;
    }

    .currencyButton {
      border: 2px solid black;
      color: black;
    }
  }
}

@media screen and (min-width: 1800px) {
  body {
    font-size: 2em;
  }

  .cartItems, .currencyButton {
    font-size: 0.5em;
  }
  
}

</style>
