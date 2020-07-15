import { text, select, boolean, object } from '@storybook/addon-knobs'

import McButton from './McButton'
import McSvgIcon from '../McSvgIcon/McSvgIcon'
import { getTokensByType } from "../../utils/getTokens"

export default {
  title: 'Elements/McButton',
  component: McButton,
  parameters: {
    componentSubtitle: 'Subtitle for this component',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LXNkU1vlAYmydEiC0l0gDa/MC-Design-System?node-id=1%3A2',
    },
  },
};

const types = {
  'button': 'button',
  'reset': 'reset',
  'submit': 'submit',
  'default': null,
}
const sizes = {
  's': 's',
  's-compact': 's-compact',
  'm': 'm',
  'm-compact': 'm-compact',
  'l': 'l',
  'l-compact': 'l-compact',
}
const positions = {
  'left': 'left',
  'center': 'center',
  'right': 'right',
}
const tokenColors = getTokensByType('color')
let variations = {}
Object.keys(tokenColors).forEach(c => {
  const colorVariations = {
    [c]: c,
    [`${c}-flat`]: `${c}-flat`,
    [`${c}-invert`]: `${c}-invert`,
    [`${c}-outline`]: `${c}-outline`,
    [`${c}-link`]: `${c}-link`,
  }
  variations = {
    ...variations,
    ...colorVariations,
  }
})

const getUniqueProps = key => {
  return {
    to: {
      default: object('to', { name: 'test', params: { id: 123 }, }, key),
    },
    href: {
      default: text('href', 'https://mediacube.agency/', key),
    },
    nuxt: {
      default: boolean('nuxt', true, key),
    },
    disabled: {
      default: boolean('disabled', false, key),
    },
    loading: {
      default: boolean('loading', false, key),
    },
    type: {
      default: select('type', types, 'default', key)
    },
    variation: {
      default: select('variation', variations, 'blue', key),
    },
    size: {
      default: select('size', sizes, 'm', key)
    },
    shadow: {
      default: boolean('shadow', false, key),
    },
    rounded: {
      default: boolean('rounded', false, key),
    },
    textAlign: {
      default: select('textAlign', positions, 'center', key),
    },
    fullWidth: {
      default: boolean('fullWidth', false, key),
    },
    isActive: {
      default: boolean('isActive', false, key),
    },
    exact: {
      default: boolean('exact', false, key),
    },
    uppercase: {
      default: boolean('uppercase', false, key),
    },
    defaultTag: {
      default: text('defaultTag', 'button', key),
    },
  }
}

const getCommonTags = ctx => {
  return {
    to: ctx.to,
    href: ctx.href,
    nuxt: ctx.nuxt,
    disabled: ctx.disabled,
    loading: ctx.loading,
    type: ctx.type,
    variation: ctx.variation,
    size: ctx.size,
    shadow: ctx.shadow,
    rounded: ctx.rounded,
    'text-align': ctx.textAlign,
    'full-width': ctx.fullWidth,
    'is-active': ctx.isActive,
    exact: ctx.exact,
    uppercase: ctx.uppercase,
    'default-tag': ctx.defaultTag,
  }
}

export const Default = () => ({
  components: { McButton },
  computed: {
    tagBind() {
      return getCommonTags(this)
    }
  },
  props: {
    ...getUniqueProps('default'),
    value: {
      default: text('slot default', 'Default button', 'default'),
    },
  },
  template: `<mc-button v-bind="tagBind"> {{ value }} </mc-button>`,
});

// mc-button with icons
export const WithIcons = () => ({
  components: { McButton, McSvgIcon },
  computed: {
    tagBind() {
      return getCommonTags(this)
    }
  },
  props: {
    ...getUniqueProps('withIcons'),
    value: {
      default: text('slot default', 'Button with icons', 'withIcons'),
    },
    isIconPrepend: {
      default: boolean('slot icon prepend', true, 'withIcons'),
    },
    isIconAppend: {
      default: boolean('slot icon append', true, 'withIcons'),
    },
  },
  template: `<mc-button v-bind="tagBind">
      <mc-svg-icon v-if="isIconPrepend" slot="icon-prepend" name="info" />
      {{ value }}
      <mc-svg-icon v-if="isIconAppend" slot="icon-append" name="face" />
  </mc-button>`,
});

