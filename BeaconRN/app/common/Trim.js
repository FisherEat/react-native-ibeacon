function trim(aString) {
    return aString.replace(/(^\s*)|(\s*$)/g, "")
}

function ltrim(aString) {
    return aString.replace(/(^\s*)/g, "")
}

function rtrim(aString) {
    return aString.replace(/(\s*$)/g, "")
}

export default {trim, ltrim, rtrim}
