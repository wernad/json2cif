type Rows = {
    "annotation": string[],
    "channel": string[],
    "layer": string[],
    "residue": string[],
    "layer_residue": string[],
    "hetResidue": string[],
    "profile": string[]
}

export const JSON2CIF = (name: string, data: string) => {
    const headers = {
        "annotation": `loop_
_annotation.id
_annotation.channel_id
_annotation.name
_annotation.description
_annotation.reference
_annotation.reference_type`,

        "channel": `loop_
_channel.id
_channel.type # Path, Pore, etc
_channel.method # CSATunnel_MOLE, CSATunnel_Caver, etc
_channel.auto # bool
_channel.cavity`,

        "layer": `loop_
_layer.id
_layer.channel_id
_layer.order # order in channel
_layer.min_radius
_layer.min_free_radius
_layer.start_distance
_layer.end_distance
_layer.local_minimum # bool
_layer.bottleneck`,

        "residue": `loop_
_residue.id
_residue.name
_residue.sequence_number # order
_residue.chain_id # A, B`,

        "layer_residue": `loop_
_layer_residue.layer_id
_layer_residue.residue_id
_layer_residue.flow
_layer_residue.backbone # bool`,

        "het_residue": `loop_
_het_residue.id
_het_residue.channel_id
_het_residue.name
_het_residue.sequence_number
_het_residue.chain_id`,

        "profile": `loop_
_profile.id
_profile.channel_id
_profile.radius
_profile.free_radius
_profile.distance
_profile.T
_profile.x
_profile.y
_profile.z
_profile.charge`,
    }

    const data_json = JSON.parse(data);

    const rows: Rows = {
        "annotation": [],
        "channel": [],
        "layer": [],
        "residue": [],
        "layer_residue": [],
        "hetResidue": [],
        "profile": []
    }

    for (const ann of data_json["Annotations"]) {
        rows.annotation.push(`${ann["Id"]} ${ann["Name"]} ${ann["Description"]} ${ann["Reference"]} ${ann["ReferenceType"]}`);
    }

    const methods = data_json["Channels"];
    for (const method in methods) {
        const channels = methods[method];
        for (const channel of channels) {
            const channelId = channel["Id"]
            rows.channel.push(`${channelId} ${channel["Type"]} ${method} ${channel["Auto"]} ${channel["Cavity"]}`);

            const profiles: [] = channel["Profile"];
            for (const profile of profiles) {
                rows.profile.push(`${rows.profile.length + 1} ${channelId} ${profile["Radius"]} ${profile["FreeRadius"]} ${profile["T"]} ${profile["Distance"]} ${profile["X"]} ${profile["Y"]} ${profile["Z"]} ${profile["Charge"]}`);
            }

            const layers = channel["Layers"];
            const hets = layers["HetResidues"];
            const layersInfo = layers["LayersInfo"];
            for (const het of hets) {
                const split_het = het.split(" ");
                rows.hetResidue.push(`${channelId} ${split_het[0]} ${split_het[1]} ${split_het[2]} ${split_het.length > 3 ? "True" : "False"}`)
            }

            for (const [order, layer] of layersInfo.entries()) {
                const properties = layer["Properties"];
                const geometry = layer["LayerGeometry"]
                const bottleneck = "Bottleneck" in geometry ? `${geometry["Bottleneck"]}` : "False";
                const layerId = rows.layer.length + 1;
                rows.layer.push(`${layerId} ${channelId} ${order + 1} ${geometry["MinRadius"]} ${geometry["MinFreeRadius"]} ${geometry["StartDistance"]} ${geometry["EndDistance"]} ${geometry["LocalMinimum"]} ${bottleneck} ${properties["Charge"]} ${properties["NumPositives"]} ${properties["NumNegatives"]} ${properties["Hydrophobicity"]} ${properties["Hydropathy"]} ${properties["Polarity"]} ${properties["Mutability"]}`);

                const residues = layer["Residues"];
                for (const [flow, res] of residues.entries()) {
                    const split_res = res.split(" ");
                    const res_str = `${split_res[0]} ${split_res[1]} ${split_res[2]}`
                    let resIdx = rows.residue.findIndex(item => {
                        const no_id_item = item.split(" ").slice(1).join(" ");
                        return no_id_item === res_str;
                    });

                    if (resIdx === -1) {
                        resIdx = rows.residue.length + 1;
                        rows.residue.push(`${resIdx} ${res_str}`);
                    } else {
                        resIdx = resIdx + 1;
                    }
                    rows.layer_residue.push(`${layerId} ${resIdx} ${flow + 1} ${split_res.length > 3 ? "True" : "False"}`)
                }
            }
        }
    }

    const cif = `
${headers.annotation}
${rows.annotation.join("\n")}

${headers.channel}
${rows.channel.join("\n")}

${headers.profile}
${rows.profile.join("\n")}

${headers.layer}
${rows.layer.join("\n")}

${headers.residue}
${rows.residue.join("\n")}

${headers.layer_residue}
${rows.layer_residue.join("\n")}

${headers.het_residue}
${rows.hetResidue.join("\n")}
`

    return `${name}\n${cif}`;
};