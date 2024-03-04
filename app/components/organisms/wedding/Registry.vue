<template lang="pug">
.registry
  .heading__wrapper
    .heading {{ 'REGISTRY' }}
  .kv
    .kv__main {{ 'Your presence, prayer, and wishes are enough for a present to us.' }}
    .kv__sub {{ 'However, for you who wish to take further steps to support our new family, please check out below:' }}
  .account
    .account__item.account__item--jp.item
      .item__label {{ '金融機関名' }}
      .item__value {{ '三菱UFJ銀行' }}
      .item__label {{ '支店名' }}
      .item__value {{ '鎌倉支店' }}
      .item__label {{ '口座番号' }}
      .item__value {{ '0177989' }}
      .item__label {{ '口座の種類' }}
      .item__value {{ '普通' }}
      .item__label {{ '口座名義' }}
      .item__value {{ 'ダリエン ジョナサン' }}
    .account__item.item
      .item__label {{ 'Bank Name' }}
      .item__value {{ 'BCA' }}
      .item__label {{ 'SWIFT Code' }}
      .item__value {{ 'CENAIDJA' }}
      .item__label {{ 'Account Number' }}
      .item__value {{ '2301915251' }}
      .item__label {{ 'Account Holder\'s Name' }}
      .item__value {{ 'Daisy Christina' }}
</template>
<script lang="ts" setup></script>
<script lang="ts">
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Registry',
}
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.heading {
  &__wrapper {
    margin-bottom: 12px;
  }

  & {
    @include font-family('marcellus');
    text-align: center;
    @include pc {
      @include font($size: $font-xl, $letter-spacing: 1px);
    }
    @include sp {
      @include font($size: $font-lg, $letter-spacing: 1px);
    }
  }
}

.kv {
  & {
    @include font-family('marcellus');
    text-align: center;
    margin: 0 auto 40px;
    @include pc {
      padding: 0 40px;
      max-width: 1200px;
    }
    @include sp {
      width: 100%;
      padding: 0 20px;
    }
  }

  &__main {
    white-space: pre-line;
    @include pc {
      margin-bottom: 4px;
    }
    @include sp {
      @include font($size: $font-sm, $line-height: 1.5);
      margin-bottom: 8px;
    }
  }

  &__sub {
    @include pc {
      @include font($size: $font-sm);
    }
    @include sp {
      @include font($size: $font-xs);
    }
  }
}

.account {
  display: grid;
  margin: 0 auto;

  @include pc {
    grid-template-columns: 1fr 1fr;
    gap: 0 100px;
    max-width: 800px;
  }

  @include sp {
    gap: 40px 0;
  }
}

.item {
  display: grid;
  grid-template-columns: minmax(100px, 1fr) 1fr;
  align-items: center;
  gap: 8px 20px;

  &--jp {
    @include font-family('noto-sans-jp');
  }

  &__label {
    font-weight: bold;
  }

  @include sp {
    &__label,
    &__value {
      @include font($size: $font-sm);
    }
  }
}
</style>
