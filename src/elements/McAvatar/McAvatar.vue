<script>
export default {
    name: 'McAvatar',
    functional: true,
    props: {
        /**
         *  Путь до изображения
         *
         */
        src: {
            type: String,
            default: null,
        },
        /**
         *  Отложенная подгрузка
         *
         */
        lazy: {
            type: Boolean,
            default: false,
        },
        /**
         *  Атрибут alt
         */
        alt: {
            type: String,
            default: '',
        },
        /**
         *  Размеры
         */
        size: {
            type: String,
            default: '300',
        },
        /**
         *  Круглый
         *
         */
        rounded: {
            type: Boolean,
            default: false,
        },
        /**
         *  Цвет рамки
         *
         */
        borderColor: {
            type: String,
            default: '',
        },
        /**
         *  Цвет точки
         *
         */
        dotColor: {
            type: String,
            default: '',
        },
        /**
         *  Цвет точки
         *
         */
        shadow: {
            type: Boolean,
            default: false,
        },
        /**
         *  Перетаскивание изображения
         *
         */
        draggable: {
            type: Boolean,
            default: true,
        },
    },
    render(h, { props, data }) {
        const hasStatus = props.borderColor || props.dotColor

        const avatarClasses = {
            'mc-avatar': true,
            'mc-avatar--rounded': props.rounded,
            'mc-avatar--shadow': props.shadow && !hasStatus,
            [`mc-avatar--size-${props.size}`]: props.size,
            ...(!hasStatus && data.class ? data.class : {}),
        }
        const wrapperClasses = {
            'mc-avatar-status': true,
            'mc-avatar-status--shadow': props.shadow,
            [`mc-avatar-status--size-${props.size}`]: props.size,
            'mc-avatar-status--has-dot': !!props.dotColor,
            ...(data.class || {}),
        }

        if (data.staticClass) {
            const staticClasses = data.staticClass.split(' ')
            const targetClasses = hasStatus ? wrapperClasses : avatarClasses
            staticClasses.forEach(c => c && (targetClasses[c] = true))
        }

        let style = {}
        if (hasStatus) {
            if (props.borderColor) style['--mc-avatar-border-color'] = `var(--color-${props.borderColor})`
            if (props.dotColor) style['--mc-avatar-dot-color'] = `var(--color-${props.dotColor})`
        }
        if (props.size) {
            style['--mc-avatar-avatar-size'] = `var(--size-${props.size})`
            if (+props.size < 500) {
                style['--mc-avatar-avatar-radius'] = `var(--radius-50)`
            }
            switch (+props.size) {
                case 500:
                case 600: {
                    style['--mc-avatar-dot-size'] = `var(--size-150)`
                    break
                }
                case 700:
                case 800:
                case 900:
                case 1000: {
                    style['--mc-avatar-dot-size'] = `var(--size-200)`
                    style['--mc-avatar-dot-border-width'] = '2px'
                    break
                }
            }
        }
        if (data.staticStyle) {
            style = data.staticStyle
        }

        const lazyOptions = {
            name: 'lazy',
            value: {
                src: props.src,
                error: 'error',
                attempt: 1,
            },
        }
        const directives = props.lazy ? [lazyOptions] : []

        const createAvatar = () => {
            return h(
                'figure',
                {
                    class: avatarClasses,
                    style: {
                        ...(!hasStatus ? style : {}),
                    },
                },
                [
                    props?.src &&
                        h('img', {
                            class: 'mc-avatar__img',
                            attrs: {
                                alt: props.alt,
                                ...(!props.lazy ? { src: props.src } : {}),
                                draggable: props.draggable,
                            },
                            directives,
                            key: props.src,
                            on: {
                                error(e) {
                                    if (!e.target) return
                                    e.target.style.display = 'none'
                                    e.target.nextSibling.style.display = 'block'
                                },
                            },
                        }),
                    h(
                        'svg',
                        {
                            class: 'mc-avatar__img',
                            attrs: {
                                name: 'avatar-square',
                                color: 'main',
                                width: '104',
                                height: '104',
                                viewBox: '0 0 104 104',
                                fill: 'none',
                                xmlns: 'http://www.w3.org/2000/svg',
                            },
                            style: {
                                display: props?.src ? 'none' : 'block',
                            },
                        },
                        [
                            h('rect', {
                                attrs: {
                                    width: '104',
                                    height: '104',
                                    rx: '8',
                                    fill: 'currentColor',
                                },
                            }),
                            h('path', {
                                attrs: {
                                    d:
                                        'M33.3078 40.2381C33.3078 29.9814 41.6764 21.6667 51.9997 21.6667C62.3229 21.6667 70.6916 29.9814 70.6916 40.2381V42.7143C70.6916 52.971 62.3229 61.2857 51.9997 61.2857C41.6764 61.2857 33.3078 52.971 33.3078 42.7143V40.2381Z',
                                    fill: 'white',
                                },
                            }),
                            h('path', {
                                attrs: {
                                    d:
                                        'M86.6663 84.6684C78.021 93.8955 65.6887 99.6667 51.9997 99.6667C38.3107 99.6667 25.9783 93.8955 17.333 84.6684C24.1962 75.69 37.15 69.9524 51.9997 69.9524C66.8493 69.9524 79.8032 75.69 86.6663 84.6684Z',
                                    fill: 'white',
                                },
                            }),
                        ],
                    ),
                ].filter(Boolean),
            )
        }

        const createWrapper = () => {
            return h(
                'section',
                {
                    class: wrapperClasses,
                    style: {
                        ...style,
                    },
                },
                [createAvatar()],
            )
        }
        return hasStatus ? createWrapper() : createAvatar()
    },
}
</script>
<style lang="scss">
@import '../../styles/mixins';
@import '../../tokens/durations';

$color-borders: $token-colors;
$dot-colors: $token-colors;

.mc-avatar-status {
    $status-name: &;
    --mc-avatar-dot-border-width: 1px;
    --mc-avatar-dot-size: #{$space-100};
    --mc-avatar-border-color: initial;
    display: inline-flex;
    border: 2px solid var(--mc-avatar-border-color);
    padding: 1px;
    position: relative;
    border-radius: $radius-circle;

    .mc-avatar {
        border-radius: $radius-circle;
    }

    &::after {
        width: var(--mc-avatar-dot-size);
        height: var(--mc-avatar-dot-size);
        @include pseudo($display: none);
        left: 0;
        bottom: 0;
        border: var(--mc-avatar-dot-border-width) solid $color-white;
        background-color: var(--mc-avatar-dot-color);
        z-index: 2;
        border-radius: 50%;
    }
    &--has-dot {
        &:after {
            display: block;
        }
    }

    transition: box-shadow $duration-s;

    &:hover,
    &:focus {
        .mc-avatar {
            box-shadow: none;
        }
    }

    &--shadow {
        &:hover,
        &:focus {
            background-color: $color-hover-gray;
            box-shadow: 0 0 0 $space-50 $color-hover-gray;
        }
    }
}

.mc-avatar {
    $avatar-name: &;
    --mc-avatar-avatar-radius: #{$space-100};
    @include reset();
    position: relative;
    display: inline-block;
    width: var(--mc-avatar-avatar-size);
    height: var(--mc-avatar-avatar-size);
    min-width: var(--mc-avatar-avatar-size);
    border-radius: var(--mc-avatar-avatar-radius);
    overflow: hidden;
    background-color: $color-hover-gray;
    transition: box-shadow $duration-s;

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        color: var(--color-main);
    }
    &--rounded {
        border-radius: $radius-circle;
    }

    &--shadow {
        &:hover,
        &:focus {
            box-shadow: 0 0 0 $space-100 $color-hover-gray;
        }
    }
}
</style>
