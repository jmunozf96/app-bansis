import React from 'react';
import 'leaflet-draw/dist/leaflet.draw.css';
import {FeatureGroup} from 'react-leaflet';
import {EditControl} from 'react-leaflet-draw';

export default class CustomEditControl extends React.Component {
    render() {
        return (
            <FeatureGroup>
                <EditControl
                    position='topleft'
                    onCreated={(e)=> console.log(e)}
                    edit={{edit: false}}
                    draw={{
                        marker: false,
                        circle: false,
                        rectangle: false,
                        polygon: true,
                        polyline: false
                    }}
                />
                {this.props.children}
            </FeatureGroup>
        );
    }
}
