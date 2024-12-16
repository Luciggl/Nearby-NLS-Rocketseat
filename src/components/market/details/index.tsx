import { IconPhone, IconMapPin, IconTicket } from "@tabler/icons-react-native";

import { s } from "./style"
import { Alert, Text, View } from "react-native";
import { Info } from "../info";

export type PropsDetails = {
    name: string
    description: string
    address: string
    phone: string
    coupons: number
    rules: {
        id: string
        description: string
    }[]
}

type Props = {
    data: PropsDetails
}

export function Details({ data }: Props) {
    return (
        // Alert.alert("Voce esta aqui?", "Sim vc esta")
        <View style={s.container}>
            <Text style={s.name}>{data.name}</Text>
            <Text style={s.description}>{data.description}</Text>

            <View style={s.group}>
                <Text style={s.title}>Informações</Text>
                <Info icon={IconTicket} description={`${data.coupons} cupons disponiveis`}/>
                <Info icon={IconMapPin} description={data.description}/>
                <Info icon={IconPhone} description={data.phone}/>
            </View>

            <View style={s.group}>
                <Text style={s.title}>
                    Regulamento
                </Text>
                {data.rules.map((item) => (
                    <Text key={item.id}
                    style={s.rule}>
                        {`\u2022 ${item.description}`}
                    </Text>
                ))}
            </View>
        </View>
    )
}