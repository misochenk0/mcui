<template>
  <div class="mc-date-picker" :class="classes">
    <label :for="name" class="mc-date-picker__header">
      <!-- @slot Слот для заголовка над инпутом -->
      <slot name="title">
        <mc-title :ellipsis="false" v-if="title">{{ title }}</mc-title>
      </slot>
    </label>
    <div class="mc-date-picker__inner">
      <div class="mc-date-picker__input-wrapper">
<!--        :type="type"-->
<!--        :append-to-body="appendToBody"-->
<!--        :disabled-date="disabledDate"-->
<!--        :clearable="clearable"-->
<!--        :input-props="inputProps"-->
<!--        :placeholder="placeholder"-->
<!--        :name="name"-->
<!--        :id="name"-->
<!--        :range="range"-->
<!--        :inline="inline"-->
<!--        :disabled="disabled"-->
<!--        :popup-style="popupStyle"-->
        <date-picker
          v-model="prettyValue"
          v-on="listeners"
          v-bind="$attrs"
          ref="input"
          class="mc-date-picker__date-picker"
          range-separator=" — "
          :confirm="$attrs.range"
          :input-attr="{ name, id: `${name}-id` }"
          :lang="lang"
          :format="format"
          :editable="editable"
          :popup-class="popupClass"
          @input="val => handleEmitDate(val)"
          @pick="handlePickDate"
        >
          <div v-if="$slots.header" slot="header">
            <!-- @slot Слот для вставки в хедер попапа календаря -->
            <slot name="header" />
          </div>
          <div v-if="$slots.sidebar" slot="sidebar">
            <!-- @slot Слот для вставки в сайдбар попапа календаря  -->
            <slot name="sidebar" />
          </div>
          <div v-if="$slots.input" slot="input">
            <!-- @slot Слот для вставки в инпут попапа календаря -->
            <slot name="input" />
          </div>
          <template v-if="$slots.footer || $attrs.range" v-slot:footer="{ emit }">
            <!-- @slot Слот для вставки в футер попапа календаря -->
            <slot name="footer">
              <div class="mc-datepicker__footer-popup">
                <div>
                  <mc-button variation="black-link" secondary-color="blue" @click="selectPeriod('week')">
                    {{ placeholders.week }}
                  </mc-button>
                  <mc-button variation="black-link" secondary-color="blue" @click="selectPeriod('month')">
                    {{ placeholders.month }}
                  </mc-button>
                  <mc-button variation="black-link" secondary-color="blue" @click="selectPeriod('quarter')">
                    {{ placeholders.quarter }}
                  </mc-button>
                  <mc-button variation="black-link" secondary-color="blue" @click="selectPeriod('year')">
                    {{ placeholders.year }}
                  </mc-button>
                </div>
                <mc-button variation="blue-outline" size="xs" @click="() => emit(prettyValue)">
                  {{ placeholders.confirm }}
                </mc-button>
              </div>
            </slot>
          </template>

          <!-- @slot Слот для вставки пользовательской иконки календаря -->
          <template slot="icon-calendar">
            <mc-svg-icon class="mc-date-picker__icon" name="calendar" />
          </template>
        </date-picker>
      </div>
    </div>
    <div class="mc-date-picker__footer" v-if="errorText || helpText || $slots.bottom">
      <mc-title v-if="errorText" tag-name="div" :ellipsis="false" color="red" variation="overline">
        {{ errorText }}
      </mc-title>
      <br v-if="errorText" />
      <!-- @slot Слот для доп. текста под инпутом -->
      <slot name="bottom">
        <mc-title v-if="helpText" tag-name="div" :ellipsis="false" variation="overline">
          {{ helpText }}
        </mc-title>
      </slot>
    </div>
  </div>
</template>

<script>
import _omit from "lodash/omit"
import DatePicker from "vue2-datepicker"
import "vue2-datepicker/locale/ru"
import "vue2-datepicker/locale/en"
import "vue2-datepicker/locale/es"

import McTitle from "../McTitle/McTitle"
import McSvgIcon from "../McSvgIcon/McSvgIcon"
import McButton from "../McButton/McButton"

export default {
  name: "McDatePicker",
  components: {
    McSvgIcon,
    McTitle,
    DatePicker,
    McButton,
  },
  props: {
    /**
     *  Заголовок поля:
     */
    title: {
      type: String,
      default: '',
    },

    /**
     *  Вспомогательный текст под инпутом:
     */
    helpText: {
      type: String,
      default: '',
    },

    /**
     *  Редактируемый инпут
     *
     */
    editable: {
      type: Boolean,
      default: false,
    },

    /**
     *  Значение
     *
     */
    value: {
      default: null,
    },

    /**
     *  Name
     *
     */
    name: {
      type: String,
      required: true,
    },

    /**
     *  Локаль
     */
    lang: {
      type: String,
      default: "en",
    },

    /**
     *  Ошибки
     */
    errors: {
      type: Array,
      default: () => [],
    },

    /**
     *  Формат даты (как в moment.js)
     *
     */
    format: {
      type: String,
      default: "DD.MM.YYYY",
    },

    /**
     *  Формат отдаваемой даты
     *
     */
    toFormat: {
      type: String,
      default: "YYYY-MM-DD",
    },
    /**
     *  Формат отдаваемой даты
     *
     */
    placeholders: {
      type: Object,
      default: () => {
        return {
          week: 'Week',
          month: 'Month',
          quarter: 'Quarter',
          year: 'Year',
          confirm: 'Confirm',
        }
      },
    },
  },

  data() {
    return {
      prettyValue: null,
      pickDate: null,
    }
  },
  watch: {
    value(newVal) {
      if (this.$attrs.range) {
        this.prettyValue = newVal.map(item => new Date(item))
      } else {
        this.prettyValue = new Date(newVal)
      }
    },
  },
  mounted() {
    if (this.$attrs.range) {
      this.prettyValue = this.value
          ? this.value.map(item => new Date(item))
          : [new Date(), new Date()]
    } else {
      this.prettyValue = this.value ? new Date(this.value) : new Date()
    }
  },
  computed: {
    classes() {
      return {
        "mc-date-picker--error": this.errorText,
        "mc-date-picker--disabled": this.$attrs.disabled,
      }
    },
    popupClass() {
      return {
        "datepicker-popup": true,
        ...(this.$attrs.popupClass || {}),
      }
    },

    errorText() {
      if (!this.errors || !this.errors.length) return ''
      return this.errors.join(", ")
    },

    listeners() {
      return _omit(this.$listeners, "input")
    },
  },

  methods: {
    handleInput(value) {
      /**
       * Событие инпута
       * @property {string}
       */
      this.$emit("input", value)
    },

    handleEmitDate(value) {
      let newValue = value
      if (!value || !value.length) {
        newValue = this.$moment(value).format(this.toFormat)
      }
      this.handleInput(newValue)
    },
    selectPeriod(key) {
      const start = new Date()
      const end = this.pickDate || new Date()
      switch (key) {
        case 'week':
          start.setTime(end.getTime() - 6 * 24 * 3600 * 1000)
          break
        case 'month':
          start.setMonth(end.getMonth() - 1, end.getDate())
          break
        case 'quarter':
          start.setMonth(end.getMonth() - 3, end.getDate())
          break
        case 'year':
          start.setFullYear(end.getFullYear() - 1, end.getMonth(), end.getDate())
          break
      }
      this.prettyValue = [start, end]
    },
    handlePickDate(date) {
      this.pickDate = date
    },
  },
}
</script>

<style lang="scss">
@import '~vue2-datepicker/scss/index.scss';
.mc-date-picker {
  $block-name: &;

  display: block;

  &__header {
    @include reset-text-indents();
    display: block;
    margin-bottom: $space-100;

    &:empty {
      display: none;
    }
  }

  &__inner {
    display: flex;
    align-items: center;
  }

  &__input-wrapper {
    width: 100%;
  }

  &__footer {
    margin-top: $space-50;

    &:empty {
      display: none;
    }
  }

  &__icon {
    font-size: inherit;
  }
  .mx-input-wrapper {
    width: 100%;
  }
  .mx-input {
    font-family: $font-family-main;
    font-size: $font-size-200;
    line-height: $line-height-200;
    height: $size-500;
    padding: $space-100 $space-100 $space-100 36px;
    border-color: $color-outline-gray;
    border-radius: $radius-100;
    cursor: pointer;
    color: $color-black;
    &:hover,
    &:focus {
      border-color: $color-blue;
    }
  }

  &--error {
    .mx-input {
      border-color: $color-red !important;
    }
  }
  &--disabled {
    .mx-input {
      color: $color-outline-gray;
      cursor: not-allowed;
      background-color: $color-hover-gray;
      border-color: $color-outline-gray;
      box-shadow: none;
      &:hover,
      &:focus {
        border-color: $color-outline-gray;
      }
    }
    .mx-icon-calendar {
      color: $color-outline-gray;
    }
  }
}

.mx-datepicker {
  width: 100%;
  svg {
    @include size($space-300);
  }
  &-inline {
    width: auto;
  }
}
.mx-icon-calendar {
  right: unset;
  left: $space-100;
  color: $color-black;
}

.mx-input-wrapper:hover .mx-icon-clear + .mx-icon-calendar {
  display: block;
}
.datepicker-popup {
  font-family: $font-family-main;
  border-radius: $radius-150;
  box-shadow: $shadow-s;
  z-index: 12222;

  .mx-calendar + .mx-calendar {
    border-left: none;
  }

  .mx-calendar {
    width: 256px;
    padding: $space-200;
    font-size: $font-size-200;

    &-panel-date {
      .cell {
        @include size($size-400);
      }
    }
    &-header {
      line-height: $line-height-300;
      height: auto;
      margin-bottom: $space-200;
      > .mx-btn-text {
        min-width: $size-300;
      }
      &-label {
        font-size: $font-size-200;
        line-height: $line-height-200;
        font-weight: $font-weight-semi-bold;
        color: $color-black;
        .mx-btn-text {
          font-size: $font-size-200;
          line-height: $line-height-200;
          font-weight: $font-weight-semi-bold;
        }
      }
      .mx-btn-text {
        color: $color-black;
        &:hover {
          color: $color-blue;
        }
      }
      .mx-icon {
        &-left:before,
        &-right:before {
          @include size($size-150);
          border-width: 3px 0 0 3px;
        }
        &-double-right,
        &-double-left {
          display: none;
        }
      }
    }
    &-content {
      height: auto;
      th {
        font-size: $font-size-200;
        color: $color-dark-gray;
      }
    }
  }

  .mx-datepicker-footer {
    padding: $space-150 0 $space-200 0;
    margin: 0 $space-200;
    .mc-datepicker__footer-popup {
      display: flex;
      justify-content: space-between;
      align-items: center;
      > * {
        @include child-indent-right($space-300);
      }
    }
    .mx-btn.mx-datepicker-btn-confirm {
      display: none;
    }
  }

  .cell {
    height: $space-500;
    color: $color-black;
    font-size: $font-size-200;
    line-height: $line-height-200;
    div {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: $radius-100;
    }
    &:hover {
      color: $color-blue;
      background-color: fade-out($color-blue, 0.9);
      border-radius: $radius-100;
    }
    &.today {
      color: $color-blue;
    }
    &.active {
      color: $color-white;
      background-color: $color-white;

      div {
        background-color: $color-blue;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: $shadow-s;
      }

    }
    &.in-range {
      background-color: rgba(37, 120, 244, 0.1);
      color: $color-black;
      border-radius: 0;

      &:hover {
        div {
          color: $color-blue;
          background-color: fade-out($color-blue, 0.9);
          border-radius: $radius-100;
        }
      }

      //+ .cell.active {
      //  background-color: rgba(37, 120, 244, 0.1);
      //  border-radius: 0 $radius-100 $radius-100 0;
      //}
    }
    &.not-current-month {
      user-select: none;
      pointer-events: none;
      color: $color-hover-gray !important;
    }
    &.disabled {
      color: $color-outline-gray;
      border-radius: 0;
      background-color: $color-hover-gray;
      &.today {
        color: $color-blue;
      }
    }
  }

  .mx-calendar-decade-separator:after {
    content: "-";
  }
}
</style>