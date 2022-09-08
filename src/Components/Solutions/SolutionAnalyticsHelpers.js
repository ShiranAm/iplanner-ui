export function getSolutionForecastData(solution) {
    let forecastsList = [];
    for (let [productId, forecastAchieved] of Object.entries(solution.forecast_achieved)) {
        forecastsList.push({'key': "Product #" + productId, 'value': forecastAchieved + " %"})
    }
    return forecastsList
}

export function getRawMaterialsUsageData(solution) {
    let rawMaterialsList = [];
    for (let [materialId, usage] of Object.entries(solution.raw_materials_usage)) {
        rawMaterialsList.push({'key': "Material #" + materialId, 'value': usage + " %"})
    }
    return rawMaterialsList
}

export function getProdLineUtilData(solution) {
    let prodLinesUtilList = [];
    for (let [prodLineId, utilPercentage] of Object.entries(solution.product_line_utilization)) {
        prodLinesUtilList.push({'key': "Production Line #" + prodLineId, 'value': utilPercentage + " %"})
    }
    return prodLinesUtilList
}