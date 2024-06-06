<template>
  <div fluid class="mt-2">
    <ClosingDialog />
    <Drafts />
    <SalesOrders />
    <Returns />
    <NewAddress />
    <MpesaPayments />
    <Variants />
    <OpeningDialog v-if="dialog" :dialog="dialog" />
    <v-row v-show="!dialog">
      <v-col
        v-show="!payment && !offers && !coupons"
        xl="5"
        lg="5"
        md="5"
        sm="5"
        cols="12"
        class="pos pr-0"
      >
        <ItemsSelector />
      </v-col>
      <v-col
        v-show="offers"
        xl="5"
        lg="5"
        md="5"
        sm="5"
        cols="12"
        class="pos pr-0"
      >
        <PosOffers />
      </v-col>
      <v-col
        v-show="coupons"
        xl="5"
        lg="5"
        md="5"
        sm="5"
        cols="12"
        class="pos pr-0"
      >
        <PosCoupons />
      </v-col>
      <v-col
        v-show="payment"
        xl="5"
        lg="5"
        md="5"
        sm="5"
        cols="12"
        class="pos pr-0"
      >
        <Payments />
      </v-col>

      <v-col xl="7" lg="7" md="7" sm="7" cols="12" class="pos">
        <Invoice />
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import evntBus from '../../bus';
import ItemsSelector from './ItemsSelector.vue';
import Invoice from './Invoice.vue';
import OpeningDialog from './OpeningDialog.vue';
import Payments from './Payments.vue';
import PosOffers from './PosOffers.vue';
import PosCoupons from './PosCoupons.vue';
import Drafts from './Drafts.vue';
import SalesOrders from "./SalesOrders.vue";
import ClosingDialog from './ClosingDialog.vue';
import NewAddress from './NewAddress.vue';
import Variants from './Variants.vue';
import Returns from './Returns.vue';
import MpesaPayments from './Mpesa-Payments.vue';

const dialog = ref(false);
const pos_profile = ref('');
const pos_opening_shift = ref('');
const payment = ref(false);
const offers = ref(false);
const coupons = ref(false);

const check_opening_entry = () => {
  return frappe
    .call('posawesome.posawesome.api.posapp.check_opening_shift', {
      user: frappe.session.user,
    })
    .then((r) => {
      if (r.message) {
        pos_profile.value = r.message.pos_profile;
        pos_opening_shift.value = r.message.pos_opening_shift;
        get_offers(pos_profile.value.name);
        evntBus.emit('register_pos_profile', r.message);
        evntBus.emit('set_company', r.message.company);
        console.info('LoadPosProfile');
      } else {
        create_opening_voucher();
      }
    });
};

const create_opening_voucher = () => {
  dialog.value = true;
};

const get_closing_data = () => {
  return frappe
    .call(
      'posawesome.posawesome.doctype.pos_closing_shift.pos_closing_shift.make_closing_shift_from_opening',
      {
        opening_shift: pos_opening_shift.value,
      }
    )
    .then((r) => {
      if (r.message) {
        evntBus.emit('open_ClosingDialog', r.message);
      }
    });
};

const submit_closing_pos = (data) => {
  frappe
    .call(
      'posawesome.posawesome.doctype.pos_closing_shift.pos_closing_shift.submit_closing_shift',
      {
        closing_shift: data,
      }
    )
    .then((r) => {
      if (r.message) {
        evntBus.emit('show_message', {
          text: `POS Shift Closed`,
          color: 'success',
        });
        check_opening_entry();
      }
    });
};

const get_offers = (pos_profile) => {
  return frappe
    .call('posawesome.posawesome.api.posapp.get_offers', {
      profile: pos_profile,
    })
    .then((r) => {
      if (r.message) {
        console.info('LoadOffers');
        evntBus.emit('set_offers', r.message);
      }
    });
};

const get_pos_setting = () => {
  frappe.db.get_doc('POS Settings', undefined).then((doc) => {
    evntBus.emit('set_pos_settings', doc);
  });
};

onMounted(() => {
  check_opening_entry();
  get_pos_setting();

  evntBus.on('close_opening_dialog', () => {
    dialog.value = false;
  });
  evntBus.on('register_pos_data', (data) => {
    pos_profile.value = data.pos_profile;
    get_offers(pos_profile.value.name);
    pos_opening_shift.value = data.pos_opening_shift;
    evntBus.emit('register_pos_profile', data);
    console.info('LoadPosProfile');
  });
  evntBus.on('show_payment', (data) => {
    payment.value = data === 'true';
    offers.value = false;
    coupons.value = false;
  });
  evntBus.on('show_offers', (data) => {
    offers.value = data === 'true';
    payment.value = false;
    coupons.value = false;
  });
  evntBus.on('show_coupons', (data) => {
    coupons.value = data === 'true';
    offers.value = false;
    payment.value = false;
  });
  evntBus.on('open_closing_dialog', () => {
    get_closing_data();
  });
  evntBus.on('submit_closing_pos', (data) => {
    submit_closing_pos(data);
  });
});

onBeforeUnmount(() => {
  evntBus.off('close_opening_dialog');
  evntBus.off('register_pos_data');
  evntBus.off('LoadPosProfile');
  evntBus.off('show_offers');
  evntBus.off('show_coupons');
  evntBus.off('open_closing_dialog');
  evntBus.off('submit_closing_pos');
});
</script>

<style scoped></style>
