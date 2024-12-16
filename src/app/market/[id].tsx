import { Alert, Text, View, Modal, StatusBar, ScrollView } from "react-native";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { api } from "@/src/services/api";
import { useEffect, useState, useRef } from "react";
import { useCameraPermissions, CameraView } from "expo-camera"

import { Button } from "@/src/components/button";
import { Loading } from "@/src/components/loading";
import { Cover } from "@/src/components/market/cover";
import { Coupon } from "@/src/components/market/coupon";
import { Details, PropsDetails } from "@/src/components/market/details";

type DataProps = PropsDetails & {
    cover: string
}
export default function Market() {
    const [data, setData] = useState<DataProps>()
    const [coupon, setCoupon] = useState<string | null>(null)
    const [couponIsFetching, setCouponIsFetching] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false)

    const [_, requestPermission] = useCameraPermissions()
    const params = useLocalSearchParams<{ id: string }>()

    const qrLock = useRef(false)

    async function fetchMarket() {
        try {
            const { data } = await api.get("/markets/" + params.id)
            setData(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            Alert.alert("Error", "Não foi possivel carregar os dados", [
                { text: "OK", onPress: () => router.back() },
            ])
        }
    }


    async function handlerOpenCamera() {
        try {
            const { granted } = await requestPermission()
            if (!granted) {
                return Alert.alert("Câmera", "Você precisa habilitar o uso da câmera")
            }
            qrLock.current = false
            setIsVisibleCameraModal(true)
        } catch (error) {
            console.log(error)
            Alert.alert("Câmera", "Não foi possivel utilizar a câmera")
        }
    }

    async function getCoupon(id: string) {
        try {
            setCouponIsFetching(true)

            const { data } = await api.patch(`/coupons/${id}`)

            Alert.alert("Cupom", data.coupon)
            setCoupon(data.coupon)
        } catch (error) {
            console.log(error)
            Alert.alert("Error", "Não foi possível utilizar o cupom")
        } finally {
            setCouponIsFetching(false)
        }
    }

    function handlerUseCoupon(id: string) {
        setIsVisibleCameraModal(false)

        Alert.alert("Cupom", "Não é possivel reutilizar um cupom resgatado. Deseja realmente resgatar o cupom?",
            [
                { style: "cancel", text: "Não" },
                { text: "Sim", onPress: () => getCoupon(id) }
            ]
        )
    }

    useEffect(() => {
        fetchMarket()
    }, [params.id, coupon])

    if (isLoading) {
        return <Loading />
    }

    if (!data) {
        return <Redirect href="/home" />
    }
    return (
        <View style={{ flex: 1 }}>
            <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Cover uri={data.cover} />
                <Details data={data} />
                {coupon && <Coupon code={coupon} />}
            </ScrollView>
            <View style={{ padding: 32 }}>
                <Button onPress={handlerOpenCamera}>
                    <Button.Title >Ler QR Code</Button.Title>
                </Button>
            </View>
            <Modal style={{ flex: 1, justifyContent: "center", alignItems: "center" }} visible={isVisibleCameraModal}>
                <CameraView
                    style={{ flex: 1 }}
                    facing="back"
                    onBarcodeScanned={({ data }) => {
                        if (data && !qrLock.current) {
                            qrLock.current = true
                            setTimeout(() => handlerUseCoupon(data), 500)
                        }
                        console.log(data)
                    }} />
                <View style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
                    <Button onPress={() => setIsVisibleCameraModal(false)} isLoading={couponIsFetching}>
                        <Button.Title >Voltar</Button.Title>
                    </Button>
                </View>
            </Modal>
        </View>
    )
}