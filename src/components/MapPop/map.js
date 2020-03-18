import React, { memo, useState, useMemo, useRef, useCallback, useEffect, useContext } from 'react';
import { Map, Markers, InfoWindow } from 'react-amap';
import Context from '../../context'

const styles = {
    mapWrapper: {
        width: "100%",
        height: "100%",
        overflow: "hidden"
    }
}

class MarKerBean {
    position;
    _id;
    constructor (lng, lat, _id) {
        this.position = {  
            longitude: lng,
            latitude: lat
        }
        this._id = _id
    }
}

const MyMap = memo(function MyMap ({ setInput, thePin }) {   
    // 放在前面 查看是不是查看好友
    const { state, dispatch } = useContext(Context);

    // 判断是查看特定点还是新增点 还是查看好友的店 来确定中心
    const { position, pins } = useMemo(() => {
        const res = { position: null, pins: null }
        // 在这里返回null 代表只是在新增一个点
        if (!thePin && !state.friend){}
        // 查看某一个特定点
        else if ( !!thePin && !state.friend ) res.position = { longitude: thePin.longitude, latitude: thePin.latitude } 
        // 是查看好友
        else if ( !thePin && !!state.friend ) {
            if (state.friend.length === 0) res.pins = []
            else {
                const pin = state.friend[state.friend.length - 1];
                res.position = { longitude: pin.longitude, latitude: pin.latitude }
                res.pins = state.friend.map(pin => new MarKerBean(pin.longitude, pin.latitude,pin._id))
            }  
        }
        return res
    },[ thePin, state ]);

    // 确定初始位置
    const [ center, ] = useState(!!position? position : { longitude: 116.123465, latitude: 39.456787 });
    // 确定屏幕上的点
    const [ markers, setMarkers ] = useState(() => {
        if (!position) return []
        if (!!position && !pins) return [position]
        return pins
    });

    const markersRef = useRef(null);
    const mapRef = useRef(null);

    const addPin = useCallback(({ lng, lat }) => {
        // 如果是查看朋友的点 不执行此操作
        if (!!pins) return 
        setTimeout(()=> setMarkers([{ position: { longitude: lng,latitude:lat } }]), 100)
    }, [ mapRef, setMarkers, pins ]);

    const onMapClick = useCallback(e => addPin(e.lnglat), [ addPin ]);

    // 退出时 卸载地图的点击事件
    useEffect(() => () => !!mapRef.current && mapRef.current.off('click', onMapClick), []);

    const { mapEvents, markersEvents } = useMemo(() => {
        return {
            mapEvents: { created: instance => {mapRef.current = instance;instance.on('click', onMapClick)} },
            markersEvents: {  
                created: instance => markersRef.current = instance, 
                click: (ev, marker) => {
                    // 只有是地图上有多个点时才执行这个操作
                    if (!!pins) {
                        const _id = marker.getExtData()._id
                        dispatch({ type: "SET_PIN", payload: _id })
                    }
                    setInput(ev)
            } },
        }
    }, [ setInput, dispatch, pins ])

    return (
        <div style={styles.mapWrapper}>
            <Map 
                version="1.4.15" 
                amapkey="f1ecd6bbac5b4c7f23d9c696bea42e9b" 
                events={mapEvents}
                useAMapUI={true}
                center={center}
                zoom={11}
                plugins={['ToolBar']}
            >
                {
                    markers.length > 0 && <Markers 
                        markers={markers}
                        events={markersEvents} 
                    />  
                }
                {/* <InfoWindow 
                    position={markers[0].position}
                    visible={false}
                    offset={0,0}
                    isCustom
                > 
                    <div>
                        <p><span>大傻逼</span><span>三天前</span></p>
                        <div style={{ margin:'0 auto' }}>
                            <img src="./images/1.jpg" width="50px" alt=''></img>
                        </div>
                    </div>
                </InfoWindow> */}
            </Map>
        </div>
    );
} )

export default MyMap

