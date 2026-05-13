import React, { forwardRef, PropsWithoutRef } from "react"
import { FlatList, Platform, type FlatListProps } from "react-native"
import { isRTL } from "app/i18n"
import { FlashList, FlashListProps } from "@shopify/flash-list"

export type ListViewRef<T> = FlashList<T> | FlatList<T>

export type ListViewProps<T> = PropsWithoutRef<FlashListProps<T>>

/**
 * This is a Higher Order Component meant to ease the pain of using @shopify/flash-list
 * when there is a chance that a user would have their device language set to an
 * RTL language like Arabic or Punjabi. This component will use react-native's
 * FlatList if the user's language is RTL or FlashList if the user's language is LTR.
 *
 * Because FlashList's props are a superset of FlatList's, you must pass estimatedItemSize
 * to this component if you want to use it.
 *
 * Android: FlashList báo lỗi / WARN khi cha có size ~0 lúc đổi tab (native screens) — dùng FlatList cho ổn định.
 * RTL: FlashList chưa hỗ trợ đủ — dùng FlatList.
 * @see {@link https://github.com/Shopify/flash-list/issues/544|RTL Bug Android}
 * @see {@link https://github.com/Shopify/flash-list/issues/840|Flashlist Not Support RTL}
 * @param {FlashListProps | FlatListProps} props - The props for the `ListView` component.
 * @param {React.RefObject<ListViewRef>} forwardRef - An optional forwarded ref.
 * @returns {JSX.Element} The rendered `ListView` component.
 */
const ListViewComponent = forwardRef(
  <T,>(props: ListViewProps<T>, ref: React.ForwardedRef<ListViewRef<T>>) => {
    // FlashList warns when `style` is passed directly.
    const { style: _style, ...baseProps } = props as ListViewProps<T> & { style?: unknown }

    const useRNFlatList = isRTL || Platform.OS === "android"
    if (useRNFlatList) {
      const { estimatedItemSize: _estimatedItemSize, ...flatListProps } = baseProps
      return (
        <FlatList
          {...(flatListProps as FlatListProps<T>)}
          ref={ref as React.ForwardedRef<FlatList<T>>}
        />
      )
    }

    return <FlashList {...(baseProps as FlashListProps<T>)} ref={ref as React.ForwardedRef<FlashList<T>>} />
  },
)

ListViewComponent.displayName = "ListView"

export const ListView = ListViewComponent as <T>(
  props: ListViewProps<T> & {
    ref?: React.Ref<ListViewRef<T>>
  },
) => React.ReactElement
