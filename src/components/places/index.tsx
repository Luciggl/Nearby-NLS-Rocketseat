import { Text, useWindowDimensions } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Place, PlaceProps } from "../place";
import { useRef } from "react";
import { s } from "./style";
import { navigate } from "expo-router/build/global-state/routing";
import { router } from "expo-router";

type Props = {
    data: PlaceProps[]
}

export function Places({ data }: Props) {
    const dimensions = useWindowDimensions()
    const BottomSheetRef = useRef<BottomSheet>(null)

    const snapPoints = {
        min: 278,
        max: dimensions.height - 128
    }
    return (
        <BottomSheet ref={BottomSheetRef}
            snapPoints={[snapPoints.min, snapPoints.max]}
            handleIndicatorStyle={s.indicator}
            backgroundStyle={s.container}
            enableOverDrag={false}
        >
            <BottomSheetFlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Place data={item} onPress={()=> router.navigate(`/market/${item.id}`)} />}
                contentContainerStyle={s.container}
                ListHeaderComponent={() => (
                    <Text>
                        Explore locais perto de você
                    </Text>
                )}
                showsVerticalScrollIndicator={false}
            />
        </BottomSheet>)
}