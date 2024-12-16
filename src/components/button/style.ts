import { StyleSheet } from "react-native";
import { colors, fontFamily } from "@/src/styles/theme";

export const s = StyleSheet.create({
    container: {
        height: 56,
        maxHeight: 56,
        backgroundColor: colors.green.base,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 14
    },
    text: {
        color: colors.gray[100],
        fontSize: 16,
        fontFamily: fontFamily.semiBold,
    },
});