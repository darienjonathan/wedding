<template>
  <div class="about-us">
    <div class="heading-wrapper">
      <div class="heading">{{ sectionSettings.title || 'BRIDE & GROOM' }}</div>
    </div>
    <div class="kv">
      <div v-if="sectionSettings.description.main" class="kv__main">
        {{ sectionSettings.description.main }}
      </div>
      <div v-if="sectionSettings.description.sub" class="kv__sub">
        {{ sectionSettings.description.sub }}
      </div>
    </div>
    <div class="biodata">
      <template v-for="(person, index) in couple" :key="index">
        <div class="biodata__item" :data-order="index % 2 !== 0 ? 'reverse' : ''">
          <NuxtImg
            v-if="person.imageSrc"
            class="biodata__image"
            :src="person.imageSrc"
            loading="lazy"
          />
          <div class="biodata__info">
            <div class="biodata__name">{{ getFormattedName(person) }}</div>
            <div class="biodata__parents">
              <div class="biodata__parent">{{ getPersonBiodata(person) }}</div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Person, SectionSettings } from '~/types/model/wedding/weddingSettings'
import { getOrdinal } from '~/utils/number'

type Props = {
  couple: [Person, Person]
  sectionSettings: SectionSettings
}

defineProps<Props>()

/**
 * Download Images
 */

const getFormattedName = (person: Person) => {
  const { prefix, first, last, suffix } = person.name
  const firstLine = [prefix, first.toLocaleUpperCase()].filter(v => v).join(' ')
  const secondLine = [last.toLocaleUpperCase(), suffix].filter(v => v).join(', ')
  return [firstLine, secondLine].filter(v => v).join(' ')
}

const getPersonBiodata = (person: Person) => {
  const ordinal = getOrdinal(person.childOrder)
  const childGender = person.gender === 'male' ? 'son' : 'daughter'
  const parentNames = person.parents
    .map(parent => {
      if (!parent.hasPassedAway) return parent.name
      return `${parent.name} (✝︎)`
    })
    .join(' &\n')

  return `${capitalizeFirstLetter(ordinal)} ${childGender} of\n${parentNames}`
}
</script>
<script lang="ts">
export default {
  name: 'AboutUs',
}
</script>
<style lang="scss" scoped>
@import '~/assets/css/main';

.heading {
  &__wrapper {
    margin-bottom: 60px;
  }

  & {
    @include font-family('marcellus');
    text-align: center;
    margin-bottom: 20px;
    @include pc {
      @include font($size: $font-xxhuge, $letter-spacing: 2px);
    }
    @include sp {
      @include font($size: $font-xhuge, $letter-spacing: 2px);
    }
  }
}

.kv {
  & {
    @include font-family('marcellus');
    text-align: center;
    margin: 0 auto 60px;
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
      margin-bottom: 8px;
    }
    @include sp {
      @include font($size: $font-sm, $line-height: 1.5);
      margin-bottom: 16px;
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

.biodata {
  & {
    display: grid;
    max-width: 1200px;
    margin: 0 auto 60px;
    @include pc {
      grid-template-columns: repeat(2, 1fr);
      gap: 0 50px;
    }
    @include sp {
      grid-template-rows: repeat(2, 1fr);
      gap: 30px 0;
    }
  }

  &__item {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas: 'image info';
    align-items: center;
    gap: 10px;

    &[data-order='reverse'] {
      grid-template-areas: 'info image';
    }
  }

  &__image {
    grid-area: image;
    width: 100%;
  }

  &__info {
    grid-area: info;
    text-align: center;
  }

  &__name {
    @include font-family('marcellus');
    margin-bottom: 8px;
    font-weight: bold;
    @include pc {
      @include font($size: $font-xl, $letter-spacing: 1px);
    }
    @include sp {
      @include font($size: $font-lg, $letter-spacing: 1px);
      white-space: pre-line;
    }
  }

  &__parents {
    $line-height: 1.5;
    white-space: pre-line;
    @include pc {
      @include font($size: $font-m, $line-height: $line-height);
    }
    @include sp {
      @include font($size: $font-sm, $line-height: $line-height);
    }
  }
}
</style>
