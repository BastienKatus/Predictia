const buy = () => {
    return (dispatch) => (
        dispatch({
            type: "BUY",
            payload: 1,
        })
    )
}
export default buy;