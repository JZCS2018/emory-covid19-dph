import React, { useEffect, Component, useState, createRef, useRef, Text } from 'react'
import { Container, Grid, Breadcrumb, Dropdown, Header, Loader, Divider, Rail, Sticky, Popup, Button, Menu, Modal, Accordion, Icon, List } from 'semantic-ui-react'
import AppBar from './AppBar';
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import {
    VictoryChart,
    VictoryTooltip,
    VictoryVoronoiContainer,
    VictoryContainer,
    VictoryGroup,
    VictoryBar,
    VictoryTheme,
    VictoryAxis,
    VictoryLegend,
    VictoryLine,
    VictoryLabel,
    VictoryScatter,
    VictoryPie
} from 'victory';
import Slider from "@material-ui/core/Slider";
import LazyHero from 'react-lazy-hero';
import { Waypoint } from 'react-waypoint'
// import Background from '/CoronaVirus_LightBlue.jpg';

import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import _ from 'lodash';
import { scaleQuantile, scaleQuantize } from "d3-scale";
import { quantile, ascending } from 'd3';
import fips2county from './fips2county.json'
// import configscounty from "./county_config.json";

import configs from "./state_config.json";

const casesColor = [
    "#72ABB1",
    "#337fb5"
];
const mortalityColor = [
    "#0270A1",
    "#024174"
];
const colorPalette = [
    "#e1dce2",
    "#d3b6cd",
    "#bf88b5",
    "#af5194",
    "#99528c",
    "#633c70",
];
const colorPalette1 = [
    "#67335E",
    "#6B2A4D",
    "#70213B",
    "#74182A",
    '#c6007e'
];
const colorPalette2 = [
    "#e1dce2",
    "#d3b6cd",
    "#bf88b5",
    "#af5194",
    "#99528c",

];

const dataupColor = '#6899ce';
const colorOut = '#c6007e';
const contextRef = createRef()
const nameList = ['summary', 're', 'cvi', 'si', 'urbanrural', 'poverty', 'black', 'hispanic', 'diabetes', 'age', 'male'];
var scrollCount = 0;

const countyColor = '#f2a900';
const stateColor = '#bdbfc1';
const nationColor = '#d9d9d7';
const colorHighlight = '#f2a900';
const marks = [
    {
        value: 0,
        label: 'Mar 1',
    },
    {
        value: 10,
        label: 'April 1',
    },
    {
        value: 20,
        label: 'May 1',
    },
    {
        value: 30,
        label: 'June 1',
    },
];

const sectionStyle1 = {
    width: "100%",
    height: "100%",
    backgroundColor: '#f0fafe'
};
const sectionStyle2 = {
    width: "100%",
    height: "100%",
    backgroundSize: 'cover',
    backgroundImage: `url("/CoronaVirus_LightBlue.jpg")`
};

function valuetext(value) {
    return `${value}°C`;
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function StickyExampleAdjacentContext(props) {
    const [sTate, setsTate] = useState({ activeItem: 'Interactive Map' })
    const { activeItem } = sTate
    useEffect(() => {
        setsTate(nameList[scrollCount])
        console.log('name changed!!!!!!!!')
    }, [scrollCount])
    // console.log(props.activeCharacter)
    return (

        <div >
            <Rail attached size='mini' position='left'>
                <Sticky offset={150}>
                    <Menu
                        size='small'
                        compact
                        pointing secondary vertical>
                        <Menu.Item as='a' href="#summary" name='Interactive Map' active={props.activeCharacter == 'Interactive Map' || activeItem === 'Interactive Map'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>Georgia Interactive Map</Header></Menu.Item>
                        <Menu.Item as='a' href="#age_g" name='COVID-19 Demographics' active={props.activeCharacter === 'COVID-19 Demographics' || activeItem === 'COVID-19 Demographics'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>COVID-19 Demographics</Header></Menu.Item>


                        <Menu.Item as='a' style={{ paddingLeft: '3em' }} href="#age_g" name='COVID-19 by Age' active={props.activeCharacter === 'COVID-19 by Age' || activeItem === 'COVID-19 by Age'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }}>Age</Menu.Item>
                        <Menu.Item as='a' style={{ paddingLeft: '3em' }} href="#sex_g" name='COVID-19 by Sex' active={props.activeCharacter === 'COVID-19 by Sex' || activeItem === 'COVID-19 by Sex'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }}>Sex</Menu.Item>
                        <Menu.Item style={{ paddingLeft: '3em' }} as='a' href="#re" name='COVID-19 by Race/Ethnicity' active={props.activeCharacter === 'COVID-19 by Race/Ethnicity' || activeItem === 'COVID-19 by Race/Ethnicity'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }}>Race and Ethnicity</Menu.Item>


                        <Menu.Item as='a' href="#chara" name='COVID-19 by County Characteristics' active={props.activeCharacter === 'COVID-19 by County Characteristics' || activeItem === 'COVID-19 by County Characteristics'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }}><Header as='h4'>COVID-19 County Disparities</Header></Menu.Item>

                        <Menu.Item as='a' style={{ paddingLeft: '3em' }} href="#cvi" name='Community Vulnerability Index' active={props.activeCharacter === 'Community Vulnerability Index' || activeItem === 'Community Vulnerability Index'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} >Community COVID-19 Vulnerability Index</Menu.Item>
                        <Menu.Item as='a' style={{ paddingLeft: '3em' }} href="#si" name='Residential Segregation Index' active={props.activeCharacter === 'Residential Segregation Index' || activeItem === 'Residential Segregation Index'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }}>County Racial Segregation Index</Menu.Item>
                        <Menu.Item as='a' style={{ paddingLeft: '3em' }} href="#urbanrural" name='County Metropolitan Status' active={props.activeCharacter === 'County Metropolitan Status' || activeItem === 'County Metropolitan Status'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' style={{ paddingLeft: '3em' }} href="#poverty" name='County Poverty' active={props.activeCharacter === 'County Povertyy' || activeItem === 'County Poverty'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' style={{ paddingLeft: '3em' }} href="#black" name='County African American' active={props.activeCharacter === 'County African American' || activeItem === 'County African American'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' style={{ paddingLeft: '3em' }} href="#hispanic" name='County Hispanic' active={props.activeCharacter === 'County Hispanic' || activeItem === 'County Hispanic'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' style={{ paddingLeft: '3em' }} href="#diabetes" name='County Diabetes' active={props.activeCharacter === 'County Diabetes' || activeItem === 'County Diabetes'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' style={{ paddingLeft: '3em' }} href="#age" name='County Age over 65' active={props.activeCharacter === 'County Age over 65' || activeItem === 'County Age over 65'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' style={{ paddingLeft: '3em' }} href="#male" name='County Male Percentage' active={props.activeCharacter === 'County Male Percentage' || activeItem === 'County Male Percentage'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                    </Menu>
                </Sticky>
            </Rail>
        </div>
    )

}

function SvgMap(props) {
    // var lengthSplit1 = props.lengthSplit1;
    if (props.name === 'casescum') {
        return (
            <svg width="500" height="55">
                {_.map(colorPalette, (color, i) => {
                    return <rect key={i} x={50 + 25 * i} y={20} width="25" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                })}
                {_.map(colorPalette1, (color, i) => {
                    return <rect key={i} x={200 + 25 * i} y={20} width="25" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                })}

                {/* <rect x={180} y={20} width="25" height="20" style={{ fill: colorOut, strokeWidth: 1, stroke: colorOut }} /> */}
                <text x={50} y={52} style={{ fontSize: '0.8em' }}>Low</text>
                <text x={300} y={52} style={{ fontSize: '0.8em' }}>High</text>
                {_.map(props.legendSplit['thr'][props.name], (splitpoint, i) => {
                    if (props.legendSplit['thr'][props.name][i] < 1) {
                        return <text key={i} x={57 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit['thr'][props.name][i].toFixed(1)}</text>
                    }
                    if (props.legendSplit['thr'][props.name][i] >= 1000) {
                        return <text key={i} x={70 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {(props.legendSplit['thr'][props.name][i] / 1000).toFixed(1) + "K"}</text>
                    }
                    return <text key={i} x={70 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit['thr'][props.name][i].toFixed(0)}</text>
                })}

                {_.map(props.legendSplit['thr1'], (splitpoint, i) => {
                    if (props.legendSplit['thr1'][i] >= 1000) {
                        return <text key={i} x={220 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {(props.legendSplit['thr1'][i] / 1000).toFixed(1) + "K"}</text>
                    }
                    return <text key={i} x={220 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit['thr1'][i].toFixed(0)}</text>
                })}
                <text x={325} y={15} style={{ fontSize: '0.7em' }}>{props.legendMax[props.name]>999?(props.legendMax[props.name]/1000).toFixed(0) + "K"
                :props.legendMax[props.name].toFixed(0)}</text>
                <text x={50} y={15} style={{ fontSize: '0.7em' }}> {(props.legendMin[props.name] / 100).toFixed(0)} </text>
                <rect x={5} y={20} width="25" height="20" style={{ fill: "#FFFFFF", strokeWidth: 0.5, stroke: "#000000" }} />
                <text x={8} y={52} style={{ fontSize: '0.7em' }}> N/A </text>
            </svg>

        )
    }
    if (props.name === 'casescum14dayR') {
        return (
            <svg width="500" height="55">
                {_.map(colorPalette, (color, i) => {
                    return <rect key={i} x={55 + 25 * i} y={20} width="25" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                })}

                <rect x={230} y={20} width="25" height="20" style={{ fill: colorOut, strokeWidth: 1, stroke: colorOut }} />
                <text x={55} y={52} style={{ fontSize: '0.8em' }}>Low</text>
                <text x={230} y={52} style={{ fontSize: '0.8em' }}>High</text>
                {_.map(props.legendSplit['thr'][props.name], (splitpoint, i) => {
                    if (props.legendSplit['thr'][props.name][i] < 1) {
                        return <text key={i} x={62 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit['thr'][props.name][i].toFixed(1)}</text>
                    }
                    if (props.legendSplit['thr'][props.name][i] >= 1000) {
                        return <text key={i} x={72 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {(props.legendSplit['thr'][props.name][i] / 1000).toFixed(1) + "K"}</text>
                    }
                    return <text key={i} x={72 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit['thr'][props.name][i].toFixed(0)}</text>
                })}
                {props.legendMin[props.name] < 100 ? <text x={55} y={15} style={{ fontSize: '0.7em' }}> {(props.legendMin[props.name] / 1).toFixed(0)} </text> :
                    <text x={47} y={15} style={{ fontSize: '0.7em' }}> {(props.legendMin[props.name] / 1).toFixed(0)} </text>
                }



                <text x={224} y={15} style={{ fontSize: '0.7em' }}>{props.legendSplit['thr'][props.name][colorPalette.length - 1] < 1 ? props.legendSplit['thr'][props.name][colorPalette.length - 1].toFixed(1)
                    : props.legendSplit['thr'][props.name][colorPalette.length - 1] > 1000 ?
                        (props.legendSplit['thr'][props.name][colorPalette.length - 1] / 1000).toFixed(1) + "K" : props.legendSplit['thr'][props.name][colorPalette.length - 1].toFixed(0)
                }</text>
                {/* <text x={251} y={15} style={{ fontSize: '0.7em' }}>{props.legendMax}</text> */}
                <rect x={5} y={20} width="25" height="20" style={{ fill: "#FFFFFF", strokeWidth: 0.5, stroke: "#000000" }} />
                <text x={8} y={52} style={{ fontSize: '0.7em' }}> N/A </text>

                {/* <text x={250} y={42} style={{fontSize: '0.8em'}}> Click on a county below </text>
          <text x={250} y={52} style={{fontSize: '0.8em'}}> for a detailed report. </text> */}
            </svg>

        )
    }
    else {
        return (
            <svg width="500" height="55">
                {_.map(colorPalette, (color, i) => {
                    return <rect key={i} x={55 + 25 * i} y={20} width="25" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                })}

                <rect x={230} y={20} width="25" height="20" style={{ fill: colorOut, strokeWidth: 1, stroke: colorOut }} />
                <text x={55} y={52} style={{ fontSize: '0.8em' }}>Low</text>
                <text x={230} y={52} style={{ fontSize: '0.8em' }}>High</text>
                {_.map(props.legendSplit['thr'][props.name], (splitpoint, i) => {
                    if (props.legendSplit['thr'][props.name][i] < 1) {
                        return <text key={i} x={62 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit['thr'][props.name][i].toFixed(1)}</text>
                    }
                    if (props.legendSplit['thr'][props.name][i] >= 1000) {
                        return <text key={i} x={72 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {(props.legendSplit['thr'][props.name][i] / 1000).toFixed(1) + "K"}</text>
                    }
                    return <text key={i} x={72 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit['thr'][props.name][i].toFixed(0)}</text>
                })}
                {props.legendMin[props.name] < 100 && props.legendMin[props.name]<props.legendSplit['thr'][props.name][0] ? <text x={55} y={15} style={{ fontSize: '0.7em' }}> {(props.legendMin[props.name] / 1).toFixed(0)} </text> :
                    <text x={55} y={15} style={{ fontSize: '0.7em' }}> {0} </text>
                }



                <text x={224} y={15} style={{ fontSize: '0.7em' }}>{props.legendSplit['thr'][props.name][colorPalette.length - 1] < 1 ? props.legendSplit['thr'][props.name][colorPalette.length - 1].toFixed(1)
                    : props.legendSplit['thr'][props.name][colorPalette.length - 1] > 1000 ?
                        (props.legendSplit['thr'][props.name][colorPalette.length - 1] / 1000).toFixed(1) + "K" : props.legendSplit['thr'][props.name][colorPalette.length - 1].toFixed(0)
                }</text>
                <text x={251} y={15} style={{ fontSize: '0.7em' }}>{props.legendMax[props.name]>999?(props.legendMax[props.name]/1000).toFixed(0) + "K"
                :props.legendMax[props.name].toFixed(0)}</text>
                <rect x={5} y={20} width="25" height="20" style={{ fill: "#FFFFFF", strokeWidth: 0.5, stroke: "#000000" }} />
                <text x={8} y={52} style={{ fontSize: '0.7em' }}> N/A </text>

                {/* <text x={250} y={42} style={{fontSize: '0.8em'}}> Click on a county below </text>
          <text x={250} y={52} style={{fontSize: '0.8em'}}> for a detailed report. </text> */}
            </svg>

        )
    }
}


function ChartGraph(props) {
    var varGraphPair = props.name;
    var dataTS;
    var dataTS1;
    var metric = props.metric;
    var stateFips = props.stateFips;
    var countyFips = props.countyFips;
    var countyname = props.countyname;

    if (props.metric === "casescum14dayR") {
        dataTS = _.takeRight(props.data2[stateFips + countyFips], 14);

        return (
            <VictoryChart theme={VictoryTheme.material}
                containerComponent={
                    <VictoryVoronoiContainer
                        responsive={false}
                        flyoutStyle={{ fill: "white" }}
                    />
                }
                width={730}
                height={500}
                padding={{ left: 55, right: 70, top: 10, bottom: 50 }}>
                <VictoryAxis
                    style={{
                        tickLabels: { fontSize: 23, padding: 5 }
                    }}
                    tickFormat={(t) => new Date(t * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric' })}

                    tickValues={[
                        dataTS[dataTS.length - Math.round(dataTS.length / 4) * 3 - 1].t,
                        dataTS[dataTS.length - Math.round(dataTS.length / 4) * 2 - 1].t,
                        dataTS[dataTS.length - Math.round(dataTS.length / 4) - 1].t,
                        dataTS[dataTS.length - 1].t]}

                />
                <VictoryAxis dependentAxis tickCount={5}
                    style={{
                        tickLabels: { fontSize: 25, padding: 5 }
                    }}
                    tickFormat={(y) => (y < 1000 ? (Math.round(y, 2) === 0.00 ? " " : y) : (y / 1000 + 'k'))}
                />
                <VictoryBar style={{ data: { fill: stateColor } }} barWidth={8} alignment="start" data={dataTS ? dataTS : props.data2["99999"]}
                    x='t' y={varGraphPair[metric]['name'][0]}

                />
                <VictoryLine name="Line1" style={{ data: { stroke: countyColor, strokeWidth: ({ active }) => active ? 7 : 5 } }} data={dataTS ? dataTS : props.data2["99999"]}
                    x='t' y={varGraphPair[metric]['name'][1]}
                    labels={({ datum }) => `${countyname}\n` +
                        `Date: ${new Date(datum.t * 1000).toLocaleDateString()}\n` +
                        `${varGraphPair[metric]['legend'][1]}: ${Math.round(datum[varGraphPair[metric]['name'][1]], 2)}\n` +
                        `${varGraphPair[metric]['legend'][0]}: ${Math.round(datum[varGraphPair[metric]['name'][0]], 2)}`
                    }
                    labelComponent={
                        <VictoryTooltip
                            orientation="top"
                            style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'white' }}
                            constrainToVisibleArea
                            labelComponent={<VictoryLabel dx={-100} textAnchor='start' />}
                            flyoutStyle={{ fill: "black", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                        />
                    }
                />
                {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                    <VictoryAxis dependentAxis tickCount={5}
                        style={{
                            tickLabels: { fontSize: 25, padding: 5 }
                        }}
                        tickFormat={(y) => (y < 1000 ? (Math.round(y, 2) === 0.00 ? " " : y) : (y / 1000 + 'k'))}
                    /> :
                    <VictoryLine name="Line11" style={{ data: { stroke: '#007dba', strokeWidth: ({ active }) => active ? 5 : 3 } }} data={_.takeRight(props.data2[stateFips], 14) ? _.takeRight(props.data2[stateFips], 14) : props.data2["99999"]}
                        x='t' y={varGraphPair[metric]['name'][1]}
                        labels={({ datum }) => [`Georgia\n`,
                            `Date: ${new Date(datum.t * 1000).toLocaleDateString()}\n`,
                            `${varGraphPair[metric]['legend'][1]}: ${Math.round(datum[varGraphPair[metric]['name'][1]], 2)}\n`,
                            `${varGraphPair[metric]['legend'][0]}: ${Math.round(datum[varGraphPair[metric]['name'][0]], 2)}`
                        ]}
                        labelComponent={
                            <VictoryTooltip
                                orientation="top"
                                style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'white' }}
                                constrainToVisibleArea
                                labelComponent={<VictoryLabel dx={-100} textAnchor='start' />}
                                flyoutStyle={{ fill: "black", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                            />
                        }
                    />}
            </VictoryChart>)
    }
    else {
        dataTS = props.data2;
        return (
            <VictoryChart theme={VictoryTheme.material}
                containerComponent={
                    <VictoryVoronoiContainer

                        responsive={false}
                        flyoutStyle={{ fill: "black" }}
                    />
                }
                width={730}
                height={500}
                padding={{ left: 55, right: 70, top: 10, bottom: 50 }}>
                <VictoryAxis
                    style={{
                        tickLabels: { fontSize: 23, padding: 5 }
                    }}
                    tickFormat={(t) => new Date(t * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric' })}
                    tickValues={[
                        // 1583035200, 1585713600, 1588305600, 1590984000, 1593576000
                        dataTS['13001'][0].t,
                        dataTS["13001"][31].t,
                        dataTS["13001"][61].t,
                        dataTS["13001"][92].t,
                        dataTS["13001"][122].t,
                        dataTS["13001"][153].t,
                        dataTS["13001"][184].t,
                        dataTS["13001"][214].t,
                        dataTS["13001"][245].t,

                        dataTS["13001"][dataTS["13001"].length - 1].t
                    ]}


                />
                <VictoryAxis dependentAxis tickCount={6}
                    style={{
                        tickLabels: { fontSize: 25, padding: 5 }
                    }}
                    tickFormat={(y) => (y < 1000 ? (Math.round(y, 2) === 0.00 ? " " : y) : (y / 1000 + 'k'))}
                />
                <VictoryBar style={{ data: { fill: stateColor } }} barWidth={4} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                    x='t' y={varGraphPair[metric]['name'][0]}

                />
                {countyFips === '' ? <VictoryLine style={{ data: { stroke: '007dba', strokeWidth: 0 } }} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                    x='t' y={varGraphPair[metric]['name'][1]}

                /> :
                    <VictoryLine name="Line1" style={{ data: { stroke: countyColor, strokeWidth: ({ active }) => active ? 7 : 5 } }} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                        x='t' y={varGraphPair[metric]['name'][1]}
                        labels={({ datum }) => `${countyname}\n` +
                            `Date: ${new Date(datum.t * 1000).toLocaleDateString()}\n` +
                            `${varGraphPair[metric]['legend'][1]}: ${Math.round(datum[varGraphPair[metric]['name'][1]], 2)}\n` +
                            `${varGraphPair[metric]['legend'][0]}: ${Math.round(datum[varGraphPair[metric]['name'][0]], 2)}`
                        }
                        labelComponent={
                            <VictoryTooltip
                                orientation="top"
                                style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'white' }}
                                constrainToVisibleArea
                                labelComponent={<VictoryLabel dx={-75} textAnchor='start' />}
                                flyoutStyle={{ fill: "black", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                            />
                        }
                    />}
                {countyFips === '' ? (varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                    <VictoryLine name="Line11" style={{ data: { stroke: '#007dba', strokeWidth: ({ active }) => active ? 5 : 3 } }} data={dataTS[stateFips] ? dataTS[stateFips] : dataTS["99999"]}
                        x='t' y={varGraphPair[metric]['name'][1]}
                        labels={({ datum }) => [`Georgia\n`,
                            `Date: ${new Date(datum.t * 1000).toLocaleDateString()}    \n`,
                            `${varGraphPair[metric]['legend'][1]}: ${Math.round(datum[varGraphPair[metric]['name'][1]], 2)}\n`,
                            `${varGraphPair[metric]['legend'][0]}: ${Math.round(datum[varGraphPair[metric]['name'][0]], 2)}`
                        ]}
                        labelComponent={
                            <VictoryTooltip
                                // orientation="top"
                                style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'white' }}
                                constrainToVisibleArea
                                // flyoutComponent={<CustomFlyout/>}
                                labelComponent={<VictoryLabel dx={-80} textAnchor='start' />}
                                flyoutStyle={{ fill: "black", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                            />
                        }
                    /> :
                    <VictoryLine name="Line11" style={{ data: { stroke: '#007dba', strokeWidth: ({ active }) => active ? 5 : 3 } }} data={dataTS[stateFips] ? dataTS[stateFips] : dataTS["99999"]}
                        x='t' y={varGraphPair[metric]['name'][1]}
                        labels={({ datum }) => [`Georgia\n`,
                            `Date: ${new Date(datum.t * 1000).toLocaleDateString()}    \n`,
                            `${varGraphPair[metric]['legend'][1]}: ${Math.round(datum[varGraphPair[metric]['name'][1]], 2)}\n`,
                            `${varGraphPair[metric]['legend'][0]}: ${Math.round(datum[varGraphPair[metric]['name'][0]], 2)}`
                        ]}
                        labelComponent={
                            <VictoryTooltip
                                // orientation="top"
                                style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'white' }}
                                constrainToVisibleArea
                                // flyoutComponent={<CustomFlyout/>}
                                labelComponent={<VictoryLabel dx={-80} textAnchor='start' />}
                                flyoutStyle={{ fill: "black", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                            />
                        }

                    />) :
                    (varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                        <VictoryAxis dependentAxis tickCount={6}
                            style={{
                                tickLabels: { fontSize: 25, padding: 5 }
                            }}
                            tickFormat={(y) => (y < 1000 ? (Math.round(y, 2) === 0.00 ? " " : y) : (y / 1000 + 'k'))} /> :
                        <VictoryLine name="Line11" style={{ data: { stroke: '#007dba', strokeWidth: ({ active }) => active ? 5 : 3 } }} data={dataTS[stateFips] ? dataTS[stateFips] : dataTS["99999"]}
                            x='t' y={varGraphPair[metric]['name'][1]}
                            labels={({ datum }) => [`Georgia\n`,
                                `Date: ${new Date(datum.t * 1000).toLocaleDateString()}    \n`,
                                `${varGraphPair[metric]['legend'][1]}: ${Math.round(datum[varGraphPair[metric]['name'][1]], 2)}\n`,
                                `${varGraphPair[metric]['legend'][0]}: ${Math.round(datum[varGraphPair[metric]['name'][0]], 2)}`
                            ]}
                            labelComponent={
                                <VictoryTooltip
                                    // orientation="top"
                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'white' }}
                                    constrainToVisibleArea
                                    // flyoutComponent={<CustomFlyout/>}
                                    labelComponent={<VictoryLabel dx={-80} textAnchor='start' />}
                                    flyoutStyle={{ fill: "black", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                />
                            }
                        />
                    )}
                
            </VictoryChart>
            
            )
            
    }
    
}
// ["casescum",
// "deathscum",
// "casescumR",
// "deathscumR",
// "casescum14dayR"] 

function DiscrpMap(props) {
    if (props.name === 'casescum') {
        return (
            <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                The map shows the total number of COVID-19 cases recorded in each county. The darker shading indicates a larger number of cases.
                This number represents confirmed cases only, defined as an individual with a positive molecular test. Only molecular test results
                are used in identifying confirmed cases. These test results are reported through multiple sources including:
                <br></br>

                <List as='ul'>
                    <List.Item as='li'>Electronic Lab Reporting (ELR)</List.Item>
                    <List.Item as='li'>State Electronic Notifiable Disease Surveillance System (SendSS)</List.Item>
                    <List.Item as='li'>Faxed case reports</List.Item>
                    <List.Item as='li'>Calls from providers to DPH</List.Item>
                </List>
            </p>
        )
    }
    if (props.name === 'deathscum') {
        return (
            <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                The map shows the total number of COVID-19 deaths recorded in each county. This number includes confirmed COVID-19 cases that were
                either reported to DPH as deceased by healthcare providers, medical examiners/coroners, or identified by death certificates with COVID-19
                indicated as the cause of death.
            </p>
        )
    }
    if (props.name === 'casescumR') {
        return (
            <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                The map shows the total number of COVID-19 cases per 100,000 residents recorded in each county. The darker shading indicates a larger number
                of cases per 100,000 residents. This number represents confirmed cases only, defined as an individual with a positive molecular test. Only molecular
                test results are used in identifying confirmed cases. These test results are reported through multiple sources including:
                <br></br>
                <List as='ul'>
                    <List.Item as='li'>Electronic Lab Reporting (ELR)</List.Item>
                    <List.Item as='li'>State Electronic Notifiable Disease Surveillance System (SendSS)</List.Item>
                    <List.Item as='li'>Faxed case reports</List.Item>
                    <List.Item as='li'>Calls from providers to DPH</List.Item>
                </List>
            </p>
        )
    }
    if (props.name === 'deathscumR') {
        return (
            <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                The map shows the total number of COVID-19 deaths per 100,000 residents recorded in each county. This number includes confirmed COVID-19 cases that
                were either reported to DPH as deceased by healthcare providers, medical examiners/coroners, or identified by death certificates with COVID-19 indicated as the cause of death.
            </p>
        )
    }
    if (props.name === 'casescum14dayR') {
        return (
            <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                The map shows the number of new COVID-19 cases per 100,000 residents recorded in the last two weeks for each county. The darker shading indicates a larger number of cases per 100,000
                residents in the last two weeks. This number represents confirmed cases only, defined as an individual with a positive molecular test. Only molecular test results are used in identifying
                confirmed cases. These test results are reported through multiple sources including:
                <br></br>

                <List as='ul'>
                    <List.Item as='li'>Electronic Lab Reporting (ELR)</List.Item>
                    <List.Item as='li'>State Electronic Notifiable Disease Surveillance System (SendSS)</List.Item>
                    <List.Item as='li'>Faxed case reports</List.Item>
                    <List.Item as='li'>Calls from providers to DPH</List.Item>
                </List>
            </p>
        )
    }
}

function DiscrpChart(props) {
    if (props.name === 'casescum') {
        return (
            <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                This chart shows the daily number of new confirmed COVID-19 cases in {props.county}. The vertical bars show the
                number of new daily cases while the line shows the 7-day moving average of new daily cases. The daily COVID-19
                case numbers represent confirmed cases only, defined as an individual with a positive molecular test. Only molecular
                test results are used in identifying confirmed cases. These test results are reported through multiple sources including:
                <br></br>

                <List as='ul'>
                    <List.Item as='li'>Electronic Lab Reporting (ELR)</List.Item>
                    <List.Item as='li'>State Electronic Notifiable Disease Surveillance System (SendSS)</List.Item>
                    <List.Item as='li'>Faxed case reports</List.Item>
                    <List.Item as='li'>Calls from providers to DPH</List.Item>
                </List>
                <br></br>
                The daily number reflects the date the case was first reported to DPH.
            </p>
        )
    }
    if (props.name === 'deathscum') {
        return (
            <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                This chart shows the daily number of new confirmed COVID-19 deaths in {props.county}. The vertical bars show the number of new daily
                deaths while the line shows the 7-day moving average of new daily deaths. This number includes confirmed COVID-19 cases that were
                either reported to DPH as deceased by healthcare providers, medical examiners/coroners, or identified by death certificates with COVID-19
                indicated as the cause of death. The daily number reflects the date the death was first reported to DPH.
            </p>
        )
    }
    if (props.name === 'casescumR') {
        return (
            <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                This chart shows the daily number of new confirmed COVID-19 cases per 100,000 residents in {props.county}. The vertical bars show the number of new
                daily cases per 100,000 residents while the line shows the 7-day moving average of new daily cases. The daily COVID-19 case numbers represent
                confirmed cases only, defined as an individual with a positive molecular test. Only molecular test results are used in identifying confirmed cases.
                These test results are reported through multiple sources including:
                <br></br>
                <List as='ul'>
                    <List.Item as='li'>Electronic Lab Reporting (ELR)</List.Item>
                    <List.Item as='li'>State Electronic Notifiable Disease Surveillance System (SendSS)</List.Item>
                    <List.Item as='li'>Faxed case reports</List.Item>
                    <List.Item as='li'>Calls from providers to DPH</List.Item>
                </List>
                            The daily number reflects the date the case was first reported to DPH.
            </p>
        )
    }
    if (props.name === 'deathscumR') {
        return (
            <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                This chart shows the daily number of new confirmed COVID-19 deaths per 100,000 residents in {props.county}. The vertical bars show the number of new daily deaths
               per 100,000 residents while the line shows the 7-day moving average of new daily deaths per 100,000 residents. This number includes confirmed COVID-19 cases
               that were either reported to DPH as deceased by healthcare providers, medical examiners/coroners, or identified by death certificates with COVID-19 indicated
               as the cause of death. The daily number reflects the date the death was first reported to DPH.
            </p>
        )
    }
    if (props.name === 'casescum14dayR') {
        return (
            <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                    This chart shows the daily number of new confirmed COVID-19 cases in {props.county}. The vertical bars show the
                number of new daily cases while the line shows the 7-day moving average of new daily cases. The daily COVID-19
                case numbers represent confirmed cases only, defined as an individual with a positive molecular test. Only molecular
                test results are used in identifying confirmed cases. These test results are reported through multiple sources including:
                <br></br>

                    <List as='ul'>
                        <List.Item as='li'>Electronic Lab Reporting (ELR)</List.Item>
                        <List.Item as='li'>State Electronic Notifiable Disease Surveillance System (SendSS)</List.Item>
                        <List.Item as='li'>Faxed case reports</List.Item>
                        <List.Item as='li'>Calls from providers to DPH</List.Item>
                    </List>
                    <br></br>
                The daily number reflects the date the case was first reported to DPH.
            </p>
            </p>
        )
    }
}

export default function StateMap(props) {

    // let { stateFips } = useParams();
    const stateFips = '13';
    const [config, setConfig] = useState();
    // const [stateName, setStateName] = useState('');
    const countyFips1 = useRef('');
    const countyName1 = useRef('Georgia');
    var [countyFips, setCountyFips] = useState(() => {
        const initialState ='';
        return initialState;
      });
    const [countyFipscvi, setCountyFipscvi] = useState('');
    const [countyFipssi, setCountyFipssi] = useState('');
    const [countyFipsubr, setCountyFipsubr] = useState('');
    const [countyFipsblack, setCountyFipsblack] = useState('');
    const [countyFipshis, setCountyFipshis] = useState('');
    const [countyFipspov, setCountyFipspov] = useState('');
    const [countyFipsdia, setCountyFipsdia] = useState('');
    const [countyFipsa65, setCountyFipsa65] = useState('');
    const [countyFipsmale, setCountyFipsmale] = useState('');
    const [countyName, setCountyName] = useState('Georgia');
    const [countyNamecvi, setCountyNamecvi] = useState('Fulton County');
    const [countyNamesi, setCountyNamesi] = useState('Fulton County');
    const [countyNameubr, setCountyNameubr] = useState('Fulton County');
    const [countyNameblack, setCountyNameblack] = useState('Fulton County');
    const [countyNamehis, setCountyNamehis] = useState('Fulton County');
    const [countyNamepov, setCountyNamepov] = useState('Fulton County');
    const [countyNamedia, setCountyNamedia] = useState('Fulton County');
    const [countyNamea65, setCountyNamea65] = useState('Fulton County');
    const [countyNamemale, setCountyNamemale] = useState('Fulton County');

    const history = useHistory();
    // const [fips, setFips] = useState('13');
    const [activeCharacter, setActiveCharacter] = useState('')
    const activeClass = 'character-block--active';
    const characterRef = createRef();
    

    const [data, setData] = useState();
    const [dataUs, setDataUs] = useState();
    const [data_index, setIndexData] = useState();
    const [dataCha, setDataCha] = useState();

    const [dateCur, setDateCur] = useState();
    const [colorCVI, setColorCVI] = useState();
    const [colorSI, setColorSI] = useState();
    const [colorUbr, setColorUbr] = useState();
    const [colorBlack, setColorBlack] = useState();
    const [colorHis, setColorHis] = useState();
    const [colorPov, setColorPov] = useState();
    const [colorDia, setColorDia] = useState();
    const [colorA65, setColorA65] = useState();
    const [colorMale, setColorMale] = useState();
    const [covidMetric, setCovidMetric] = useState({ casesdaily: 'N/A', casesdailymean14: 'N/A', t: 'n/a' });
    const [covidMetric14, setCovidMetric14] = useState({ casesdaily: 'N/A', casesdailymean14: 'N/A', t: 'n/a' });
    const covidMetric141 = useRef({ casesdaily: 'N/A', casesdailymean14: 'N/A', t: 'n/a' });
    const colors = {
        "3": '#024174',
        '2': "#99bbcf",
        '1': '#337fb5'
    };
    const [dataTS, setDataTS] = useState();
  
    const [tooltipContent, setTooltipContent] = useState('')
    const [colorScale, setColorScale] = useState();
    const [data_cases, setDataCG] = useState();
    const [data_deaths, setDataDG] = useState();
    const [datades_cases, setDatadesCG] = useState();
    const [datades_deaths, setDatadesDG] = useState();

    const [legendMax, setLegendMax] = useState([]);
    const [legendMax1, setLegendMax1] = useState([]);
    const [legendMin, setLegendMin] = useState([]);
    const [legendMax_graph, setLegendMaxGraph] = useState({});
    const [legendSplit, setLegendSplit] = useState([]);
    const [legendSplit1, setLegendSplit1] = useState([]);

    const [metric, setMetric] = useState('casescumR');
    const [metric_graph, setMetricGraph] = useState(['casesdaily', 'casesdailymean14']);
    const [open, setOpen] = useState(false)

    const thresh_chara = {
        'cvi': [0, 0.53, 0.71, 0.85, 0.94, 1],
        'si': [0, 22, 29, 34, 43, 73],
        'poverty': [0, 13, 15, 16, 18, 42],
        'black': [0, 10, 23, 30, 42, 72],
        'hispanic': [0, 3, 4, 6, 9, 35],
        'diabetes': [0, 10, 12, 13, 17, 33],
        'age65over': [0, 14, 16, 17, 19, 35],
        'male': [0, 48, 49, 50, 51, 67]
    }

    const metricOptions1 = [{ key: 'cacum', value: 'casescum', text: 'Total COVID-19 cases' },
    { key: 'decum', value: 'deathscum', text: 'Total COVID-19 deaths' },
    { key: 'cacumr', value: 'casescumR', text: 'COVID-19 cases per 100,000 population' },
    { key: 'decumr', value: 'deathscumR', text: 'COVID-19 deaths per 100,000 population' },
    { key: 'cacum14R', value: 'casescum14dayR', text: 'Last 14 days cases per 100,000 population' }];

    const metricOptions2 = [{ key: 'cs', value: 'cs', text: 'Confirmed cases per 100,000 population' },
    { key: 'hp', value: 'hp', text: 'Hospitalizations per 100,000 population' },
    { key: 'ds', value: 'ds', text: 'Deaths per 100,000 population' }];
    const dropdownopt = {
        'casescum': 'Total COVID-19 cases',
        'deathscum': 'Total COVID-19 deaths',
        'casescumR': 'COVID-19 cases per 100,000 population',
        'deathscumR': 'COVID-19 deaths per 100,000 population'
    };

    const varGraphPair = {
        "casescum": { "name": ['casesdaily', 'casesdailymean7'], "legend": ['Daily cases', '7-d rolling average '] },
        "deathscum": { "name": ['deathsdaily', 'deathsdailymean7'], "legend": ['Daily deaths', '7-d rolling average '] },
        "casescumR": { "name": ['casesdailyR', 'casesdailymean7R'], "legend": ['Daily cases per 100,000', '7-d rolling average'] },
        "deathscumR": { "name": ['deathsdailyR', 'deathsdailymean7R'], "legend": ['Daily deaths per 100,000', '7-d rolling average'] },
        "casescum14dayR": { "name": ['casesdailyR', 'casesdailymean7R'], "legend": ['Last 14 days cases per 100,000', '7-d rolling average'] }
    };
    const [metricName, setMetricName] = useState('COVID-19 cases per 100,000 population');
    const varNameMap = {
        "casescum": { "name": 'cases', "text": "The map shows the total number of confirmed COVID-19 cases in each county as of ", "cat": 'case' },
        "casescum14dayR": { "name": 'cases per 100,000 residents', "text": "The map shows the number of confirmed COVID-19 cases for past two weeks in each county as of ", "cat": 'case' },
        "deathscum": { "name": 'deaths', "text": "The map shows the total number of confirmed COVID-19 deaths in each county as of ", "cat": 'death' },
        "casescumR": { "name": 'cases per 100,000 residents', "text": "The map shows the total number of confirmed COVID-19 cases per 100,000 residents in each county as of ", "cat": 'case' },
        "deathscumR": { "name": 'deaths per 100,000 residents', "text": "The map shows the total number of confirmed COVID-19 deaths per 100,000 residents in each county as of ", "cat": 'death' }
    };
    const varMap = { "cacum": metricOptions2[0], "decum": metricOptions2[1], "cacumr": metricOptions2[2], "decumr": metricOptions1[1] };
    const [delayHandler, setDelayHandler] = useState(null)
    // contextRef = createRef()

    // useEffect(() => {
    //     console.log(characterRef)
    //     const handleIntersection = function(entries) {
    //       entries.forEach((entry) => {
    //         if (entry.target.id !== activeCharacter && entry.isIntersecting) {
    //           setActiveCharacter(entry.target.id);
    //         }
    //       });
    //     };
    //     const observer = new IntersectionObserver(handleIntersection);
    //     observer.observe(characterRef.current);
    //     return () => observer.disconnect(); // Clenaup the observer if component unmount.
    //   }, [activeCharacter, setActiveCharacter, characterRef]);


    useEffect(() => {
        
        const configMatched = configs.find(s => s.fips === stateFips);
        // console.log(configMatched.fips);
        if (!configMatched) {
            history.push('/');
        } else {

            setConfig(configMatched);
            // console.log(countyFips);
            fetch('/data/data_cases_ga.json').then(res => res.json())
                .then(x => setDataCG(x)
                );
            fetch('/data/data_deaths_ga.json').then(res => res.json())
                .then(x => setDataDG(x));
            fetch('/data/data_describe_cases.json').then(res => res.json())
                .then(x => setDatadesCG(x));
            fetch('/data/data_describe_deaths.json').then(res => res.json())
                .then(x => setDatadesDG(x));
            fetch('/data/data.json').then(res => res.json())
                .then(x => {
                    setData(x);
                    setDataUs(x);
                    setDateCur(x)

                    const cs = scaleQuantile()
                        .domain(_.map(_.filter(_.map(x, (d, k) => {
                            d.fips = k
                            return d
                        }),
                            d => (
                                d['cvi'] >= 0)),
                            d => d['cvi']))
                        .range(colorPalette2);

                    let scaleMap = {}
                    _.each(x, d => {
                        if (d[metric] >= 0) {
                            scaleMap[d['cvi']] = cs(d['cvi'])
                        }
                    });
                    // console.log(cs)
                    setColorCVI(scaleMap);

                    const si = scaleQuantile()
                        .domain(_.map(_.filter(_.map(x, (d, k) => {
                            d.fips = k
                            return d
                        }),
                            d => (
                                d['si'] >= 0)),
                            d => d['si']))
                        .range(colorPalette2);

                    let scaleMapsi = {}
                    _.each(x, d => {
                        if (d[metric] >= 0) {
                            scaleMapsi[d['si']] = si(d['si'])
                        }
                    });

                    setColorSI(scaleMapsi);
                });

            fetch('/data/timeseries13' + '.json').then(res => res.json())
                .then(
                    x => {
                        setDataTS(x);
                        // var max = 0
                        var dicto = {}
                        for (var key in x) {
                            var max = 0
                            _.each(x[key], m => {
                                if (m[varGraphPair[metric]['name'][0]] > max) {
                                    max = m[varGraphPair[metric]['name'][0]];
                                }
                            });
                            dicto[key] = max;
                            // console.log(varNameMap['cacum'].text);
                        }
                        // console.log(dicto);
                        setLegendMaxGraph(dicto);
                    });
                    
            fetch('/data/index_data.json').then(res => res.json())
                .then(x => {
                    setIndexData(x)
                    // console.log(x)

                });
            fetch('/data/data_cases_ga.json').then(res => res.json())
                .then(x => {

                    // setDataCG(x)
                    const his = scaleQuantile()
                        .domain(_.map(_.filter(_.map(x, (d, k) => {
                            d.fips = k
                            return d
                        }),
                            d => (
                                d['hispanicP'] >= 0)),
                            d => d['hispanicP']))
                        .range(colorPalette2);

                    let scaleMap_his = {}
                    _.each(x, d => {
                        if (d['hispanicP'] >= 0) {
                            scaleMap_his[d['hispanicP']] = his(d['hispanicP'])
                        }
                    });
                    setColorHis(scaleMap_his);



                }
                );
               
            fetch('/data/data_us.json').then(res => res.json())
                .then(x => {
                    setDataCha(x)
                    // const cs = scaleQuantile()
                    //     .domain(_.map(_.filter(_.map(x, (d, k) => {
                    //         d.fips = k
                    //         return d
                    //     }),
                    //         d => (
                    //             d['_013_Urbanization_Code'] >= 0)),
                    //         d => d['_013_Urbanization_Code']))
                    //     .range(colorPalette);

                    let scaleMap = {}
                    _.each(x, d => {
                        if (d['_013_Urbanization_Code'] === 1.0) {
                            scaleMap[d['_013_Urbanization_Code']] = colorPalette[0]
                        }
                        if (d['_013_Urbanization_Code'] === 2.0) {
                            scaleMap[d['_013_Urbanization_Code']] = colorPalette[1]
                        }
                        if (d['_013_Urbanization_Code'] === 3.0) {
                            scaleMap[d['_013_Urbanization_Code']] = colorPalette[2]
                        }
                        if (d['_013_Urbanization_Code'] === 4.0) {
                            scaleMap[d['_013_Urbanization_Code']] = colorPalette[3]
                        }
                        if (d['_013_Urbanization_Code'] === 5.0) {
                            scaleMap[d['_013_Urbanization_Code']] = colorPalette[4]
                        }
                        if (d['_013_Urbanization_Code'] === 6.0) {
                            scaleMap[d['_013_Urbanization_Code']] = colorPalette[5]
                        }
                    });

                    setColorUbr(scaleMap);
                    // console.log(scaleMap)

                    const black = scaleQuantile()
                        .domain(_.map(_.filter(_.map(x, (d, k) => {
                            d.fips = k
                            return d
                        }),
                            d => (
                                d['black'] >= 0)),
                            d => d['black']))
                        .range(colorPalette2);

                    let scaleMap_black = {}
                    _.each(x, d => {
                        if (d['black'] >= 0) {
                            scaleMap_black[d['black']] = black(d['black'])
                        }
                    });
                    setColorBlack(scaleMap_black);

                    const pov = scaleQuantile()
                        .domain(_.map(_.filter(_.map(x, (d, k) => {
                            d.fips = k
                            return d
                        }),
                            d => (
                                d['poverty'] >= 0)),
                            d => d['poverty']))
                        .range(colorPalette2);

                    let scaleMap_pov = {}
                    _.each(x, d => {
                        if (d['poverty'] >= 0) {
                            scaleMap_pov[d['poverty']] = pov(d['poverty'])
                        }
                    });
                    setColorPov(scaleMap_pov);


                    const dia = scaleQuantile()
                        .domain(_.map(_.filter(_.map(x, (d, k) => {
                            d.fips = k
                            return d
                        }),
                            d => (
                                d['diabetes'] >= 0)),
                            d => d['diabetes']))
                        .range(colorPalette2);

                    let scaleMap_dia = {}
                    _.each(x, d => {
                        if (d['diabetes'] >= 0) {
                            scaleMap_dia[d['diabetes']] = dia(d['diabetes'])
                        }
                    });
                    setColorDia(scaleMap_dia);

                    const age = scaleQuantile()
                        .domain(_.map(_.filter(_.map(x, (d, k) => {
                            d.fips = k
                            return d
                        }),
                            d => (
                                d['age65over'] >= 0)),
                            d => d['age65over']))
                        .range(colorPalette2);

                    let scaleMap_age = {}
                    _.each(x, d => {
                        if (d['age65over'] >= 0) {
                            scaleMap_age[d['age65over']] = age(d['age65over'])
                        }
                    });
                    setColorA65(scaleMap_age);


                    const male = scaleQuantile()
                        .domain(_.map(_.filter(_.map(x, (d, k) => {
                            d.fips = k
                            return d
                        }),
                            d => (
                                d['male'] >= 0)),
                            d => d['male']))
                        .range(colorPalette2);

                    let scaleMap_male = {}
                    _.each(x, d => {
                        if (d['male'] >= 0) {
                            scaleMap_male[d['male']] = male(d['male'])
                        }
                    });
                    setColorMale(scaleMap_male);
                });
                
        }

        fetch('data/casescum.json').then(res=>res.json())
        .then(x=>{
            setColorScale(x['csUs']);
            setLegendMax(x['max']);
            setLegendMin(x['min']);
            setLegendSplit({'thr':x['thr'],'thr1':x['thr1'].slice(0, 4)})
        });
        
    }, []);

    // useEffect(() => { setCountyFips(countyFips) }, [countyName])
    // useEffect(() => { console.log(countyFips) }, [countyName])

    // useEffect(() => {
    //     if (dataTS && dataTS[stateFips + countyFips1.current]) {
    //         setCovidMetric(_.takeRight(dataTS[stateFips + countyFips1.current])[0]);
    //         setCovidMetric14(_.takeRight(dataTS[stateFips + countyFips1.current], 14));
        

    //         // console.log(countyFips)
    //     }
    // }, [countyFips1.current])

    if (dataTS && dataUs) {

        return (
            <div
                className={`character-block ${activeClass}`}
                id="mycontent"
                ref={characterRef}>

                <div>
                    <LazyHero
                        imageSrc={"/CoronaVirus_LightBlue.jpg"}
                        color={'#E0F5FF'}
                        isCentered={true}
                        opacity={0}
                        parallaxOffset={0}
                        minHeight={'40vh'}
                        //chidren={}
                        style={{
                            height: "450px"
                        }}
                    >
                        <Grid column={2} style={{ paddingTop: '4em', paddingLeft: '0em', paddingBottom: '1em', width: "1260px" }} divided>
                            <Grid.Column width={5}>
                                <Grid.Row>
                                    <Header as='h1' style={{ fontWeight: 300 }}>
                                        <Header.Content style={{
                                            fontSize: "20pt",
                                            color: '#0072AE',
                                            fontWeight: 1000,
                                            textAlign: "left",
                                            paddingRight: '5em'
                                        }}>
                                            <b>Georgia COVID-19</b>
                                        </Header.Content>
                                    </Header>
                                </Grid.Row>
                                <Grid.Row>
                                    <Header as="h1" style={{
                                        fontSize: "44pt",
                                        fontWeight: 1000,
                                        textAlign: "left"
                                    }}>
                                        Health Equity Dashboard
                            </Header>
                                </Grid.Row>
                            </Grid.Column>

                            <Grid.Column width={11}>
                                <Header as='h2' style={{
                                    fontWeight: 400,
                                    fontSize: "16pt",
                                    paddingRight: 0,
                                    textAlign: "justify",
                                }}>
                                    <Header.Content>
                                        The Georgia COVID-19 Health Equity dashboard is a tool to dynamically track and compare the burden of cases and deaths across the counties in Georgia.
                                        <br></br>
                                        <br></br>
                                        We pair data on COVID-19 cases and deaths collected by the Georgia Department of Public Health with county population characteristics to document the
                                        differential impact of the epidemic across the state. These data are made available to the public in an effort to inform planning, policy development,
                                        and decision making by county health officials and individual residents. Additional information on the data used on this website can be found <a href='https://ga-covid19.ondemand.sas.com/docs/GA_COVID19_Dashboard_Guide.pdf'>here</a>.
                                        For more information on COVID-19 in Georgia, please see the Georgia Department of Public <a href="https://dph.georgia.gov/covid-19-daily-status-report ">COVD-19 Status Report</a>.
                                    </Header.Content>
                                </Header>
                            </Grid.Column>
                        </Grid>
                    </LazyHero>
                </div>
                <AppBar />

                <Container style={{ marginTop: '2em', minWidth: '1260px' }}>

                    {config &&
                        <div>

                            {/* <Breadcrumb>
                                <Breadcrumb.Section link onClick={() => history.push('/')}></Breadcrumb.Section>
            <Breadcrumb.Divider />
                                <Breadcrumb.Section active>{stateName}</Breadcrumb.Section>
                                <Breadcrumb.Divider />
                            </Breadcrumb> */}
                            <Grid stackable columns={3} style={{ width: "100%", height: "100%" }} >
                                <Grid.Column>
                                    <StickyExampleAdjacentContext activeCharacter={activeCharacter} />
                                </Grid.Column>

                                <Grid.Column width={16} style={{ width: "100%", height: "100%" }}>
                                    {/* <Divider id='summary' hidden /> */}
                                    <Grid.Row>
                                        <div id='summary' style={sectionStyle2}>
                                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "22pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                <Header.Content>
                                                    Georgia Interactive Map
                                    </Header.Content>
                                            </Header>
                                        </div>
                                    </Grid.Row>
                                    <Grid columns={2} style={{ paddingBottom: '3em' }}>
                                        <Grid.Row>
                                            <Grid.Column width={16}>
                                                <Header as='h2' style={{ fontFamily: 'lato', fontSize: "16px", paddingRight: 0, color: 'black' }}>
                                                    <Header.Content>
                                                        <Header.Subheader style={{ fontFamily: 'lato', fontSize: "16px", paddingRight: 0, paddingTop: '1em', color: 'black' }}>
                                                            <List as='ul'>
                                                                <List.Item as='li'>Select an indicator from the dropdown menu</List.Item>
                                                                <List.Item as='li'>Hover on map to see the summary of county-level data</List.Item>
                                                                <List.Item as='li'>Click map below to see county-level data</List.Item>
                                                            </List>
                                                        </Header.Subheader>
                                                    </Header.Content>
                                                </Header>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                            <Header as='h2' style={{ fontWeight: 600 }}>
                                                <Header.Content style={{ paddingTop:'-1'}}>
                                                    <Dropdown
                                                        style={{
                                                            paddingBottom:'1em',
                                                            fontSize: "17pt",
                                                            fontWeight: 600,
                                                            width: '520px',
                                                            borderTop: '1px solid #bdbfc1',
                                                            borderLeft: '1px solid #bdbfc1',
                                                            borderRight: '1px solid #bdbfc1',
                                                            borderBottom: '1px solid #bdbfc1',
                                                            borderRadius: 0,
                                                            // minHeight: '1.0em',
                                                            // paddingBottom: '0.2em'
                                                        }}
                                                        text={metricName}
                                                        search
                                                        selection
                                                        options={metricOptions1}
                                                        onChange={(e, { value }) => {
                                                            setMetric(value);
                                                            setMetricName(dropdownopt[value]);
                                                        }}
                                                    />

                                                </Header.Content>
                                            </Header>
                                            <SvgMap name={metric}
                                                legendSplit={legendSplit}
                                                legendSplit1={legendSplit1}
                                                legendMin={legendMin}
                                                legendMax={legendMax}
                                            />
                                            {/* <Header.Subheader style={{paddingLeft:'1em', fontFamily: 'lato', fontSize: "10pt", paddingTop: 1, color: 'black' }}>
                                                        Click map below to see county-level data.
                                        </Header.Subheader> */}
                                            <ComposableMap projection="geoAlbersUsa"
                                                projectionConfig={{ scale: `${config.scale}` }}
                                                width={500}
                                                height={550}
                                                data-tip=""
                                                offsetX={config.offsetX}
                                                offsetY={config.offsetY}>
                                                <Geographies data-tip='ga' data-for='ga' geography={config.url} >
                                                    {({ geographies }) => geographies.map(geo =>
                                                        <Geography
                                                            key={geo.rsmKey}
                                                            geography={geo}
                                                            onClick={() => {
                                                                history.push("/" + stateFips + "/" + geo.properties.COUNTYFP);
                                                                // console.log(geo.properties.COUNTYFP);
                                                            }}
                                                            style={{
                                                                default: {
                                                                    //  fill: "#ECEFF1",
                                                                    stroke: "#607D8B",
                                                                    strokeWidth: 0.95,
                                                                    outline: "none",
                                                                },
                                                                pressed: {
                                                                    outline: "none",
                                                                }
                                                            }}
                                                            onMouseEnter={() => {
                                                               
                                                                countyFips1.current = geo.properties.COUNTYFP
                                                                countyName1.current = fips2county[stateFips + geo.properties.COUNTYFP]
                                                                
                                                                    // setDelayHandler(setTimeout(() => {
                                                                    //     setCountyFips(geo.properties.COUNTYFP);
                                                                        setCountyName(fips2county[stateFips + geo.properties.COUNTYFP]);
                                                                    //     // setTooltipContent('Click to see more county data');
                                                                    // }, 0.1))
                                                                
                                                                
                                                            }}
                                                            onMouseLeave={() => {
                                                                // countyFips1.current = ''
                                                                // countyName1.current = 'Georgia'
                                                                // console.log(countyFips1.current)
                                                                // clearTimeout(delayHandler)
                                                                setTooltipContent("")
                                                            }}
                                                            fill={countyFips1.current === geo.properties.COUNTYFP ? countyColor :
                                                                ((dataUs[stateFips + geo.properties.COUNTYFP][metric] >=0) ?
                                                                    colorScale[stateFips + geo.properties.COUNTYFP][metric] :
                                                                    (dataUs[stateFips + geo.properties.COUNTYFP] && dataUs[stateFips + geo.properties.COUNTYFP][metric] === 0) ? '#e1dce2' : '#FFFFFF')}
                                                        />
                                                    )}
                                                </Geographies>
                                            </ComposableMap>

                                            <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingLeft: '0.3em', paddingTop: '0.5em', paddingRight: '2em' }} >
                                                Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Accordion defaultActiveIndex={1} panels={[
                                                    {
                                                        key: 'acquire-dog',
                                                        title: {
                                                            content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                            icon: 'dropdown',
                                                        },
                                                        content: {
                                                            content: (
                                                                <DiscrpMap
                                                                    name={metric}
                                                                />
                                                            ),
                                                        },
                                                    }
                                                ]

                                                } />

                                            </Grid.Row>

                                        </Grid.Column>
                                        <Grid.Column width={9} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                            <Header as='h2' style={{ fontWeight: 400, paddingLeft: "1em", paddingTop:'0.7em' }}>
                                                <Header.Content>
                                                    {/* {varGraphPair[metric]['legend'][0]} for <span style={{ color: countyColor }}>{countyName}</span> */}
                                                    {varGraphPair[metric]['legend'][0]} for <b>{countyName1.current}</b>
                                                    <Header.Subheader style={{ fontWeight: 300 }}>
                                                    </Header.Subheader>
                                                </Header.Content>
                                            </Header>
                                            <Grid>
                                                <Grid.Column>
                                                    <Grid.Row style={{ paddingLeft: "1.5", paddingTop: "1", paddingBottom: 0 }} centered>

                                                        <svg width="630" height='80'>
                                                            {countyName1.current === 'Georgia' ? <text x={75} y={20} style={{ fontSize: 16 }}></text> : <text x={75} y={20} style={{ fontSize: 16 }}>7-day rolling average in {countyName1.current}</text>}
                                                            {countyName1.current === 'Georgia' ? <rect x={50} y={12} width="0" height="0" /> : <rect x={50} y={12} width="15" height="2" style={{ fill: countyColor, strokeWidth: 1, stroke: countyColor }} />}
                                                            {console.log(countyName1.current)}


                                                            {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                                <rect x={50} y={40} width="15" height="15" style={{ fill: stateColor, strokeWidth: 1, stroke: stateColor }} /> :
                                                                <rect x={50} y={35} width="15" height="1" style={{ fill: '#007dba', strokeWidth: 1, stroke: '#007dba' }} />}

                                                            {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                                <text x={75} y={52} style={{ fontSize: 16 }}> {varGraphPair[metric]['legend'][0]} </text> :
                                                                <rect x={50} y={35} width="15" height="1" style={{ fill: '#007dba', strokeWidth: 1, stroke: '#007dba' }} />}

                                                            {countyName1.current === 'Georgia' ? (varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                                <text x={75} y={20} style={{ fontSize: 16 }}>7-day rolling average in Georgia</text> :
                                                                <text x={75} y={43} style={{ fontSize: 16 }}>7-day rolling average in Georgia</text>) :

                                                                (varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                                    <text x={250} y={12} style={{ fontSize: 0 }}></text> :
                                                                    <text x={75} y={43} style={{ fontSize: 16 }}>7-day rolling average in Georgia</text>)}

                                                            {countyName1.current === 'Georgia' ? (varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                                <rect x={50} y={12} width="15" height="1" style={{ fill: '#007dba', strokeWidth: 1, stroke: '#007dba' }} /> :
                                                                <rect x={50} y={55} width="15" height="15" style={{ fill: stateColor, strokeWidth: 1, stroke: stateColor }} />)
                                                                :
                                                                (varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                                    <rect x={0} y={0} width="0" height="0" style={{ fill: 'white', strokeWidth: 0, stroke: 'white' }} /> :
                                                                    <rect x={50} y={55} width="15" height="15" style={{ fill: stateColor, strokeWidth: 1, stroke: stateColor }} />)}

                                                            {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                                <rect x={0} y={0} width="0" height="0" style={{ fill: 'white', strokeWidth: 0, stroke: 'white' }} /> :
                                                                <text x={75} y={68} style={{ fontSize: 16 }}> {varGraphPair[metric]['legend'][0]} </text>}

                                                        </svg>
                                                        {console.log(countyFips1.current)}
                                                        <ChartGraph
                                                            name={varGraphPair}
                                                            metric={metric}
                                                            stateFips={stateFips}
                                                            countyFips={countyFips1.current}
                                                            // data1={ _.takeRight(dataTS[stateFips + countyFips1.current], 14)}
                                                            data2={dataTS}
                                                            
                                                            countyname={countyName1.current}
                                                        />
                                                    </Grid.Row>
                                                    <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '2.5em', paddingLeft: '2.9em', paddingRight: '2.9em' }} centered>
                                                        {/* <p style ={{fontFamily: 'lato', fontSize: 18, color:dataupColor, paddingLeft:'0.5em'}}> */}
                                                    Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                        {/* </p> */}
                                                    </Grid.Row>
                                                    <Grid.Row style={{ paddingLeft: '3.4em', paddingRight: '2.9em' }} centered>
                                                        <Accordion defaultActiveIndex={1} panels={[
                                                            {
                                                                key: 'acquire-dog',
                                                                title: {
                                                                    content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                    icon: 'dropdown',
                                                                },
                                                                content: {
                                                                    content: (
                                                                        <DiscrpChart
                                                                            name={metric}
                                                                            county={countyName}
                                                                        />
                                                                    ),
                                                                },
                                                            }
                                                        ]

                                                        } />

                                                    </Grid.Row>
                                                </Grid.Column>
                                            </Grid>
                                        </Grid.Column>

                                    </Grid>

                                    <Grid style={{ paddingBottom: '2em' }}>
                                        <Grid.Row>
                                            <div id='chara' style={sectionStyle2}>
                                                <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "22pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                    <Header.Content>
                                                        COVID-19 Demographics
                                    </Header.Content>
                                                </Header>
                                            </div>
                                        </Grid.Row>

                                    </Grid>
                                    <Grid >

                                        <div id='age_g' style={{ width: "100%", height: "100%" }}>
                                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "19pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                <Header.Content>
                                                    COVID-19 by Age
                                    </Header.Content>
                                            </Header>
                                        </div>
                                        <Grid style={{ paddingLeft: "7em", paddingTop: '0.5em', paddingRight: "7em", width: "100%", height: "100%" }}>
                                            <Grid.Row columns={2} style={{ paddingTop: 11 }}>
                                                <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                                    <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt", paddingRight: '2em' }}>
                                                        <Header.Content>
                                                            Distribution of COVID-19 Cases in Georgia by Age
            		                        </Header.Content>
                                                    </Header>
                                                    <VictoryChart
                                                        theme={VictoryTheme.material}
                                                        width={500}
                                                        height={300}
                                                        domainPadding={10}
                                                        scale={{ y: props.ylog ? 'log' : 'linear' }}
                                                        minDomain={{ y: props.ylog ? 1 : 0 }}
                                                        padding={{ left: 79, right: 40, top: 60, bottom: 50 }}
                                                        containerComponent={<VictoryContainer responsive={false} />}
                                                    >

                                                        <VictoryAxis label='Age group'
                                                            style={{
                                                                axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato', padding: 25 },
                                                                tickLabels: { fontSize: 18, padding: 2 }
                                                            }} />
                                                        <VictoryAxis dependentAxis
                                                            domain={[0, 1]}
                                                            style={{
                                                                tickLabels: { fontSize: 18, padding: 2 }
                                                            }}
                                                            tickFormat={(y) => (y <= 1 ? y * 100 : (y / 1000 + 'k'))} />
                                                        <VictoryLegend x={80} y={40}
                                                            orientation="horizontal"
                                                            gutter={1}
                                                            data={[
                                                                { name: 'Percentage of Cases', symbol: { fill: colors['1'], type: "square" } },
                                                                { name: "Percentage of Population", symbol: { fill: colors['2'], type: "square" } },
                                                            ]}
                                                        />
                                                        <VictoryGroup offset={20}
                                                            colorScale={"qualitative"}
                                                        >

                                                            <VictoryBar
                                                                alignment="start"
                                                                barWidth={20}
                                                                labels={({ datum }) => `Percentage of Cases: ${(datum.value * 100).toFixed(0)}%`}
                                                                data={[{ key: "< 20", 'value': data_cases['13']["019ageC_P"] || 0, 'colors': '1' },
                                                                { key: "20-44", 'value': data_cases['13']["2044ageC_P"] || 0, 'colors': '1' },
                                                                { key: "45-64", 'value': data_cases['13']["4564ageC_P"] || 0, 'colors': '1' },
                                                                { key: "65+", 'value': data_cases['13']["65ageC_P"] || 0, 'colors': '1' }]}
                                                                labelComponent={<VictoryTooltip
                                                                    orientation="top"
                                                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                                    constrainToVisibleArea
                                                                    // labelComponent={<VictoryLabel dx={-90} textAnchor='start' />}
                                                                    flyoutStyle={{ fill: colors['1'], fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                                                />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => colors[datum.colors],
                                                                        fillOpacity: 2
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                            <VictoryBar
                                                                alignment="start"
                                                                barWidth={20}
                                                                data={[{ key: "< 20", 'value': data_cases['13']["019ageP"] || 0, 'colors': '2' },
                                                                { key: "20-44", 'value': data_cases['13']["2044ageP"] || 0, 'colors': '2' },
                                                                { key: "45-64", 'value': data_cases['13']["4564ageP"] || 0, 'colors': '2' },
                                                                { key: "65+", 'value': data_cases['13']["65ageP"] || 0, 'colors': '2' }]}
                                                                labels={({ datum }) =>
                                                                    `Percentage of Population: ${numberWithCommas(parseFloat(datum.value * 100).toFixed(0))}%`
                                                                }
                                                                labelComponent={<VictoryTooltip
                                                                    orientation="top"
                                                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                                    constrainToVisibleArea
                                                                    // labelComponent={<VictoryLabel dx={-50} textAnchor='start' />}
                                                                    flyoutStyle={{ fill: "grey", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                                                />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => colors[datum.colors],
                                                                        fillOpacity: 0.7
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryGroup>
                                                    </VictoryChart>
                                                    <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                        Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                    </Grid.Row>
                                                    <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                        <Accordion defaultActiveIndex={1} panels={[
                                                            {
                                                                key: 'acquire-dog',
                                                                title: {
                                                                    content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                    icon: 'dropdown',
                                                                },
                                                                content: {
                                                                    content: (
                                                                        <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                            This chart shows the percentage of cases and percentage of the population by age for Georgia. The chart excludes data from {datades_cases['13']['age4catPmiss'].toFixed(2)}% of
                                                            confirmed cases who were missing information on age. confirmed cases who
                                                            were missing information on age. The COVID-19 case numbers represent confirmed cases only, defined as an individual with a positive
                                                            molecular test. Only molecular test results are used in identifying confirmed cases.
                                                                        </p>
                                                                    ),
                                                                },
                                                            }
                                                        ]

                                                        } />

                                                    </Grid.Row>
                                                </Grid.Column>
                                                <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                                    <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt", paddingRight: '2em' }}>
                                                        <Header.Content>
                                                            Distribution of COVID-19 Deaths in Georgia by Age
            		                        </Header.Content>
                                                    </Header>
                                                    <VictoryChart
                                                        theme={VictoryTheme.material}
                                                        width={500}
                                                        height={300}
                                                        domainPadding={10}
                                                        scale={{ y: props.ylog ? 'log' : 'linear' }}
                                                        minDomain={{ y: props.ylog ? 1 : 0 }}
                                                        padding={{ left: 79, right: 40, top: 60, bottom: 50 }}
                                                        containerComponent={<VictoryContainer responsive={false} />}
                                                    >
                                                        <VictoryAxis
                                                            label='Age group'
                                                            style={{
                                                                axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato', padding: 25 },
                                                                tickLabels: { fontSize: 18, padding: 2 }
                                                            }} />
                                                        <VictoryAxis dependentAxis
                                                            domain={[0, 1]}
                                                            style={{
                                                                tickLabels: { fontSize: 18, padding: 2 }
                                                            }}
                                                            tickFormat={(y) => (y <= 1 ? y * 100 : (y / 1000 + 'k'))} />
                                                        <VictoryLegend x={80} y={40}
                                                            orientation="horizontal"
                                                            gutter={1}
                                                            data={[
                                                                { name: 'Percentage of Deaths', symbol: { fill: colors['3'], type: "square" } },
                                                                { name: "Percentage of Population", symbol: { fill: colors['2'], type: "square" } },
                                                            ]}
                                                        />
                                                        <VictoryGroup offset={20}
                                                            colorScale={"qualitative"}
                                                        >

                                                            <VictoryBar
                                                                alignment="start"
                                                                barWidth={20}
                                                                // labels={({ datum }) => (Math.round(datum.value * 100) / 100)}
                                                                labels={({ datum }) => `Percentage of Deaths: ${numberWithCommas(parseFloat(datum.value * 100).toFixed(0))}%`}
                                                                data={[{ key: "< 20", 'value': data_deaths['13']["019ageC_P"] || 0, 'colors': '3' },
                                                                { key: "20-44", 'value': data_deaths['13']["2044ageC_P"] || 0, 'colors': '3' },
                                                                { key: "45-64", 'value': data_deaths['13']["4564ageC_P"] || 0, 'colors': '3' },
                                                                { key: "65+", 'value': data_deaths['13']["65ageC_P"] || 0, 'colors': '3' }]}
                                                                labelComponent={<VictoryTooltip
                                                                    orientation="top"
                                                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                                    constrainToVisibleArea
                                                                    // labelComponent={<VictoryLabel dx={-60} textAnchor='start' />}
                                                                    flyoutStyle={{ fill: colors['1'], fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                                                />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => colors[datum.colors],
                                                                        fillOpacity: 2
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                            <VictoryBar
                                                                alignment="start"
                                                                barWidth={20}
                                                                data={[{ key: "< 20", 'value': data_deaths['13']["019ageP"] || 0, 'colors': '2' },
                                                                { key: "20-44", 'value': data_deaths['13']["2044ageP"] || 0, 'colors': '2' },
                                                                { key: "45-64", 'value': data_deaths['13']["4564ageP"] || 0, 'colors': '2' },
                                                                { key: "65+", 'value': data_deaths['13']["65ageP"] || 0, 'colors': '2' }]}
                                                                labels={({ datum }) =>
                                                                    `Percentage of Population: ${numberWithCommas(parseFloat(datum.value * 100).toFixed(0))}%`
                                                                }
                                                                labelComponent={<VictoryTooltip
                                                                    orientation="top"
                                                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                                    constrainToVisibleArea
                                                                    flyoutStyle={{ fill: "grey", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                                                />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => colors[datum.colors],
                                                                        fillOpacity: 0.7
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryGroup>
                                                    </VictoryChart>
                                                    <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                        Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                    </Grid.Row>
                                                    <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                        <Accordion defaultActiveIndex={1} panels={[
                                                            {
                                                                key: 'acquire-dog',
                                                                title: {
                                                                    content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                    icon: 'dropdown',
                                                                },
                                                                content: {
                                                                    content: (
                                                                        <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                            This chart shows the percentage of deaths and percentage of the population by age for Georgia. The chart excludes data from {datades_deaths['13']['age4catPmiss'].toFixed(2)}% of confirmed deaths who were missing information on age. The number of deaths includes
                                                            confirmed COVID-19 cases that were either reported to DPH as deceased by healthcare providers, medical examiners/coroners, or identified by
                                                            death certificates with COVID-19 indicated as the cause of death.
                                                                        </p>
                                                                    ),
                                                                },
                                                            }
                                                        ]

                                                        } />

                                                    </Grid.Row>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>


                                        <hr
                                            style={{
                                                color: '#44a0e2',
                                                backgroundColor: '#44a0e2',
                                                height: 5,
                                                width: '100%'
                                            }}
                                        />

                                        <div id='sex_g' style={{ width: "100%", height: "100%" }}>
                                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "19pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                <Header.Content>
                                                    COVID-19 by Sex
                                    </Header.Content>
                                            </Header>
                                        </div>
                                        <Grid style={{ paddingLeft: "7em", paddingTop: '0.5em', paddingRight: "7em", width: "100%", height: "100%" }}>
                                            <Grid.Row columns={2} style={{ paddingTop: 11 }}>
                                                <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                                    <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt", paddingRight: '2em' }}>
                                                        <Header.Content>
                                                            Distribution of COVID-19 Cases in Georgia by Sex
            		                        </Header.Content>
                                                    </Header>
                                                    <VictoryChart
                                                        theme={VictoryTheme.material}
                                                        width={500}
                                                        height={300}
                                                        domainPadding={100}
                                                        scale={{ y: props.ylog ? 'log' : 'linear' }}
                                                        // minDomain={{ y: props.ylog ? 1 : 0 }}
                                                        maxDomain={{ y: 1 }}
                                                        padding={{ left: 79, right: 40, top: 60, bottom: 50 }}
                                                        containerComponent={<VictoryContainer responsive={false} />}
                                                    >
                                                        {/* <VictoryLabel style={{
                                                fontSize: 20, paddingBottom: '0.5em'
                                            }} text={props.title} x={(560) / 2} y={20} textAnchor="middle" /> */}
                                                        <VictoryAxis
                                                            label='Sex'
                                                            style={{
                                                                axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato', padding: 25 },
                                                                tickLabels: { fontSize: 18, padding: 2 }
                                                            }} />
                                                        <VictoryAxis dependentAxis
                                                            domain={[0, 1]}
                                                            style={{
                                                                tickLabels: { fontSize: 18, padding: 2 }
                                                            }}
                                                            tickFormat={(y) => (y <= 1 ? y * 100 : (y / 1000 + 'k'))} />
                                                        <VictoryLegend x={80} y={40}
                                                            orientation="horizontal"
                                                            gutter={1}
                                                            // style={{ border: { stroke: "black" } }}
                                                            data={[
                                                                { name: 'Percentage of Cases', symbol: { fill: colors['1'], type: "square" } },
                                                                { name: "Percentage of Population", symbol: { fill: colors['2'], type: "square" } },
                                                            ]}
                                                        />
                                                        <VictoryGroup offset={20}
                                                            colorScale={"qualitative"}
                                                        >

                                                            <VictoryBar
                                                                alignment="start"
                                                                barWidth={20}
                                                                // labels={({ datum }) => (Math.round(datum.value * 100) / 100)}
                                                                labels={({ datum }) => `Percentage of Cases: ${numberWithCommas(parseFloat(datum.value * 100).toFixed(0))}%`}
                                                                data={[
                                                                    { key: "Male", 'value': data_cases['13']["maleC_P"] || 0, 'colors': '1' },
                                                                    { key: "Female", 'value': data_cases['13']["femaleC_P"] || 0, 'colors': '1' }]}
                                                                labelComponent={<VictoryTooltip
                                                                    orientation="top"
                                                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                                    constrainToVisibleArea
                                                                    // labelComponent={<VictoryLabel dx={-60} textAnchor='start' />}
                                                                    flyoutStyle={{ fill: colors['1'], fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                                                />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => colors[datum.colors],
                                                                        fillOpacity: 2
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                            <VictoryBar
                                                                alignment="start"
                                                                barWidth={20}
                                                                data={[
                                                                    { key: "Male", 'value': data_cases['13']["maleP"] || 0, 'colors': '2' },
                                                                    { key: "Female", 'value': data_cases['13']["femaleP"] || 0, 'colors': '2' }]}
                                                                labels={({ datum }) =>
                                                                    `Percentage of Population: ${numberWithCommas(parseFloat(datum.value * 100).toFixed(0))}%`
                                                                }
                                                                labelComponent={<VictoryTooltip
                                                                    orientation="top"
                                                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                                    constrainToVisibleArea
                                                                    flyoutStyle={{ fill: "grey", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                                                />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => colors[datum.colors],
                                                                        fillOpacity: 0.7
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryGroup>
                                                    </VictoryChart>
                                                    <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                        Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                    </Grid.Row>
                                                    <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                        <Accordion defaultActiveIndex={1} panels={[
                                                            {
                                                                key: 'acquire-dog',
                                                                title: {
                                                                    content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                    icon: 'dropdown',
                                                                },
                                                                content: {
                                                                    content: (
                                                                        <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                            This chart shows the percentage of cases and percentage of the population by sex for Georgia. The chart excludes data from {datades_cases['13']['femalePmiss'].toFixed(2)}% of confirmed cases who were missing information on sex. Confirmed cases who
                                                            were missing information on sex. The COVID-19 case numbers represent confirmed cases only, defined as an individual with a positive
                                                            molecular test. Only molecular test results are used in identifying confirmed cases.
                                                                        </p>
                                                                    ),
                                                                },
                                                            }
                                                        ]

                                                        } />

                                                    </Grid.Row>

                                                </Grid.Column>
                                                <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                                    <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt", paddingRight: '2em' }}>
                                                        <Header.Content>
                                                            Distribution of COVID-19 Deaths in Georgia by Sex
            		                        </Header.Content>
                                                    </Header>
                                                    <VictoryChart
                                                        theme={VictoryTheme.material}
                                                        width={500}
                                                        height={300}
                                                        domainPadding={100}
                                                        scale={{ y: props.ylog ? 'log' : 'linear' }}
                                                        // minDomain={{ y: props.ylog ? 1 : 0 }}
                                                        maxDomain={{ y: 1 }}
                                                        padding={{ left: 79, right: 40, top: 60, bottom: 50 }}
                                                        containerComponent={<VictoryContainer responsive={false} />}
                                                    >
                                                        <VictoryAxis label='Sex'
                                                            style={{
                                                                axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato', padding: 25 },
                                                                tickLabels: { fontSize: 18, padding: 2 }
                                                            }} />
                                                        <VictoryAxis dependentAxis
                                                            domain={[0, 1]}
                                                            style={{
                                                                tickLabels: { fontSize: 18, padding: 2 }
                                                            }}
                                                            tickFormat={(y) => (y <= 1 ? y * 100 : (y / 1000 + 'k'))} />
                                                        <VictoryLegend x={80} y={40}
                                                            orientation="horizontal"
                                                            gutter={1}
                                                            // style={{ border: { stroke: "black" } }}
                                                            data={[
                                                                { name: 'Percentage of Deaths', symbol: { fill: colors['3'], type: "square" } },
                                                                { name: "Percentage of Population", symbol: { fill: colors['2'], type: "square" } },
                                                            ]}
                                                        />
                                                        <VictoryGroup offset={20}
                                                            colorScale={"qualitative"}
                                                        >

                                                            <VictoryBar
                                                                alignment="start"
                                                                barWidth={20}
                                                                // labels={({ datum }) => (Math.round(datum.value * 100) / 100)}
                                                                labels={({ datum }) => `Percentage of Deaths: ${numberWithCommas(parseFloat(datum.value * 100).toFixed(0))}%`}
                                                                data={[
                                                                    { key: "Male", 'value': data_deaths['13']["maleC_P"] || 0, 'colors': '3' },
                                                                    { key: "Female", 'value': data_deaths['13']["femaleC_P"] || 0, 'colors': '3' }]}
                                                                labelComponent={<VictoryTooltip
                                                                    orientation="top"
                                                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                                    constrainToVisibleArea
                                                                    // labelComponent={<VictoryLabel dx={-60} textAnchor='start' />}
                                                                    flyoutStyle={{ fill: colors['1'], fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                                                />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => colors[datum.colors],
                                                                        fillOpacity: 2
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                            <VictoryBar
                                                                alignment="start"
                                                                barWidth={20}
                                                                data={[
                                                                    { key: "Male", 'value': data_deaths['13']["maleP"] || 0, 'colors': '2' },
                                                                    { key: "Female", 'value': data_deaths['13']["femaleP"] || 0, 'colors': '2' }]}
                                                                labels={({ datum }) =>
                                                                    `Percentage of Population: ${numberWithCommas(parseFloat(datum.value * 100).toFixed(0))}%`
                                                                }
                                                                labelComponent={<VictoryTooltip
                                                                    orientation="top"
                                                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                                    constrainToVisibleArea
                                                                    // labelComponent={<VictoryLabel dx={-50} textAnchor='start' />}
                                                                    flyoutStyle={{ fill: "grey", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                                                />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => colors[datum.colors],
                                                                        fillOpacity: 0.7
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryGroup>
                                                    </VictoryChart>
                                                    <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                        Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                    </Grid.Row>
                                                    <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                        <Accordion defaultActiveIndex={1} panels={[
                                                            {
                                                                key: 'acquire-dog',
                                                                title: {
                                                                    content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                    icon: 'dropdown',
                                                                },
                                                                content: {
                                                                    content: (
                                                                        <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                            This chart shows the percentage of deaths and percentage of the population by sex for Georgia. The chart excludes data from {datades_deaths['13']['femalePmiss'].toFixed(2)}% of confirmed deaths who were missing information on sex.
                                                            The number of deaths includes confirmed COVID-19 cases that were either reported to DPH as deceased by healthcare providers, medical examiners/coroners, or identified by
                                                            death certificates with COVID-19 indicated as the cause of death.
                                                                        </p>
                                                                    ),
                                                                },
                                                            }
                                                        ]

                                                        } />

                                                    </Grid.Row>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>

                                        <hr
                                            style={{
                                                color: '#44a0e2',
                                                backgroundColor: '#44a0e2',
                                                height: 5,
                                                width: '100%'
                                            }}
                                        />
                                        <div id='re' style={{ width: "100%", height: "100%" }}>
                                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "19pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                <Header.Content>
                                                    COVID-19 by Race/Ethnicity
                                    </Header.Content>
                                            </Header>
                                        </div>

                                        <Grid style={{ paddingLeft: "7em", paddingTop: '0.5em', paddingRight: "7em", width: "100%", height: "100%" }}>
                                            <Grid.Row columns={2} style={{ paddingTop: 11 }}>
                                                <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                                    <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt", paddingRight: '2em' }}>
                                                        <Header.Content>
                                                            Distribution of COVID-19 Cases in Georgia by Race and Ethnicity
            		                        </Header.Content>
                                                    </Header>
                                                    <VictoryChart
                                                        theme={VictoryTheme.material}
                                                        width={500}
                                                        height={300}
                                                        domainPadding={10}
                                                        scale={{ y: props.ylog ? 'log' : 'linear' }}
                                                        minDomain={{ y: props.ylog ? 1 : 0 }}
                                                        padding={{ left: 79, right: 40, top: 60, bottom: 50 }}
                                                        containerComponent={<VictoryContainer responsive={false} />}
                                                    >
                                                        {/* <VictoryLabel style={{
                                                fontSize: 20, paddingBottom: '0.5em'
                                            }} text={props.title} x={(560) / 2} y={20} textAnchor="middle" /> */}
                                                        <VictoryAxis label='Race/Ethnicity'
                                                            style={{
                                                                axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato', padding: 25 },
                                                                tickLabels: { fontSize: 18, padding: 2 }
                                                            }} />
                                                        <VictoryAxis dependentAxis
                                                            domain={[0, 1]}
                                                            style={{
                                                                tickLabels: { fontSize: 18, padding: 2 }
                                                            }}
                                                            tickFormat={(y) => (y <= 1 ? y * 100 : (y / 1000 + 'k'))} />
                                                        <VictoryLegend x={80} y={40}
                                                            orientation="horizontal"
                                                            gutter={1}
                                                            // style={{ border: { stroke: "black" } }}
                                                            data={[
                                                                { name: 'Percentage of Cases', symbol: { fill: colors['1'], type: "square" } },
                                                                { name: "Percentage of Population", symbol: { fill: colors['2'], type: "square" } },
                                                            ]}
                                                        />
                                                        <VictoryGroup offset={20}
                                                            colorScale={"qualitative"}
                                                        >

                                                            <VictoryBar
                                                                alignment="start"
                                                                barWidth={20}
                                                                // labels={({ datum }) => (Math.round(datum.value * 100) / 100)}
                                                                labels={({ datum }) => `Percentage of Cases: ${numberWithCommas(parseFloat(datum.value * 100).toFixed(0))}%`}
                                                                data={[{ key: "White", 'value': data_cases['13']["whiteC_P"] || 0, 'colors': '1' },
                                                                { key: "Black", 'value': data_cases['13']["blackC_P"] || 0, 'colors': '1' },
                                                                { key: "Hispanic", 'value': data_cases['13']["hispanicC_P"] || 0, 'colors': '1' },
                                                                { key: "Other", 'value': data_cases['13']["otherNHC_P"] || 0, 'colors': '1' }]}
                                                                labelComponent={<VictoryTooltip
                                                                    orientation="top"
                                                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                                    constrainToVisibleArea
                                                                    // labelComponent={<VictoryLabel dx={-60} textAnchor='start' />}
                                                                    flyoutStyle={{ fill: colors['1'], fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                                                />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => colors[datum.colors],
                                                                        fillOpacity: 2
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                            <VictoryBar
                                                                alignment="start"
                                                                barWidth={20}
                                                                data={[{ key: "White", 'value': data_cases['13']["whiteP"] || 0, 'colors': '2' },
                                                                { key: "Black", 'value': data_cases['13']["blackP"] || 0, 'colors': '2' },
                                                                { key: "Hispanic", 'value': data_cases['13']["hispanicP"] || 0, 'colors': '2' },
                                                                { key: "Other", 'value': data_cases['13']["otherNHP"] || 0, 'colors': '2' }]}
                                                                labels={({ datum }) =>
                                                                    `Percentage of Population: ${numberWithCommas(parseFloat(datum.value * 100).toFixed(0))}%`
                                                                }
                                                                labelComponent={<VictoryTooltip
                                                                    orientation="top"
                                                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                                    constrainToVisibleArea
                                                                    // labelComponent={<VictoryLabel dx={-50} textAnchor='start' />}
                                                                    flyoutStyle={{ fill: "grey", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                                                />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => colors[datum.colors],
                                                                        fillOpacity: 0.7
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryGroup>
                                                    </VictoryChart>
                                                    <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                        Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                    </Grid.Row>
                                                    <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                        <Accordion defaultActiveIndex={1} panels={[
                                                            {
                                                                key: 'acquire-dog',
                                                                title: {
                                                                    content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                    icon: 'dropdown',
                                                                },
                                                                content: {
                                                                    content: (
                                                                        <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                            This chart shows the percentage of cases and percentage of the population by race/ethnicity for Georgia. The chart excludes data from {datades_cases['13']['race_3Pmiss'].toFixed(2)}% of confirmed cases
                                                            who were missing information on race/ethnicity. Confirmed cases who
                                                            were missing information on race/ethnicity. The COVID-19 case numbers represent confirmed cases only, defined as an individual with a positive
                                                            molecular test. Only molecular test results are used in identifying confirmed cases.
                                                                        </p>
                                                                    ),
                                                                },
                                                            }
                                                        ]

                                                        } />

                                                    </Grid.Row>

                                                </Grid.Column>
                                                <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                                    <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt", paddingRight: '2em' }}>
                                                        <Header.Content>
                                                            Distribution of COVID-19 Deaths in Georgia by Race and Ethnicity

            		                        </Header.Content>
                                                    </Header>
                                                    <VictoryChart
                                                        theme={VictoryTheme.material}
                                                        width={500}
                                                        height={300}
                                                        domainPadding={10}
                                                        scale={{ y: props.ylog ? 'log' : 'linear' }}
                                                        minDomain={{ y: props.ylog ? 1 : 0 }}
                                                        padding={{ left: 79, right: 40, top: 60, bottom: 50 }}
                                                        containerComponent={<VictoryContainer responsive={false} />}
                                                    >
                                                        {/* <VictoryLabel style={{
                                                fontSize: 20, paddingBottom: '0.5em'
                                            }} text={props.title} x={(560) / 2} y={20} textAnchor="middle" /> */}
                                                        <VictoryAxis label='Race/Ethnicity'
                                                            style={{
                                                                axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato', padding: 25 },
                                                                tickLabels: { fontSize: 18, padding: 2 }
                                                            }} />
                                                        <VictoryAxis dependentAxis
                                                            domain={[0, 1]}
                                                            style={{
                                                                tickLabels: { fontSize: 18, padding: 2 }
                                                            }}
                                                            tickFormat={(y) => (y <= 1 ? y * 100 : (y / 1000 + 'k'))} />
                                                        <VictoryLegend x={80} y={40}
                                                            orientation="horizontal"
                                                            gutter={1}
                                                            // style={{ border: { stroke: "black" } }}
                                                            data={[
                                                                { name: 'Percentage of Deaths', symbol: { fill: colors['3'], type: "square" } },
                                                                { name: "Percentage of Population", symbol: { fill: colors['2'], type: "square" } },
                                                            ]}
                                                        />
                                                        <VictoryGroup offset={20}
                                                            colorScale={"qualitative"}
                                                        >

                                                            <VictoryBar
                                                                alignment="start"
                                                                barWidth={20}
                                                                // labels={({ datum }) => (Math.round(datum.value * 100) / 100)}
                                                                labels={({ datum }) => `Percentage of Deaths: ${numberWithCommas(parseFloat(datum.value * 100).toFixed(0))}%`}
                                                                data={[{ key: "White", 'value': data_deaths['13']["whiteC_P"] || 0, 'colors': '3' },
                                                                { key: "Black", 'value': data_deaths['13']["blackC_P"] || 0, 'colors': '3' },
                                                                { key: "Hispanic", 'value': data_deaths['13']["hispanicC_P"] || 0, 'colors': '3' },
                                                                { key: "Other", 'value': data_deaths['13']["otherNHC_P"] || 0, 'colors': '3' }]}
                                                                labelComponent={<VictoryTooltip
                                                                    orientation="top"
                                                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                                    constrainToVisibleArea
                                                                    // labelComponent={<VictoryLabel dx={-60} textAnchor='start' />}
                                                                    flyoutStyle={{ fill: colors['1'], fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                                                />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => colors[datum.colors],
                                                                        fillOpacity: 2
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                            <VictoryBar
                                                                alignment="start"
                                                                barWidth={20}
                                                                data={[{ key: "White", 'value': data_deaths['13']["whiteP"] || 0, 'colors': '2' },
                                                                { key: "Black", 'value': data_deaths['13']["blackP"] || 0, 'colors': '2' },
                                                                { key: "Hispanic", 'value': data_deaths['13']["hispanicP"] || 0, 'colors': '2' },
                                                                { key: "Other", 'value': data_deaths['13']["otherNHP"] || 0, 'colors': '2' }]}
                                                                labels={({ datum }) =>
                                                                    `Percentage of Population: ${numberWithCommas(parseFloat(datum.value * 100).toFixed(0))}%`
                                                                }
                                                                labelComponent={<VictoryTooltip
                                                                    orientation="top"
                                                                    style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                                    constrainToVisibleArea
                                                                    // labelComponent={<VictoryLabel dx={-50} textAnchor='start' />}
                                                                    flyoutStyle={{ fill: "grey", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                                                />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => colors[datum.colors],
                                                                        fillOpacity: 0.7
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryGroup>
                                                    </VictoryChart>
                                                    <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                        Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                    </Grid.Row>
                                                    <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                        <Accordion defaultActiveIndex={1} panels={[
                                                            {
                                                                key: 'acquire-dog',
                                                                title: {
                                                                    content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                    icon: 'dropdown',
                                                                },
                                                                content: {
                                                                    content: (
                                                                        <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                            This chart shows the percentage of deaths and percentage of the population by race/ethnicity for Georgia. The chart excludes data from {datades_deaths['13']['race_3Pmiss'].toFixed(2)}% of confirmed
                                                            deaths who were missing information on race/ethnicity.
                                                            The number of deaths includes confirmed COVID-19 cases that were either reported to DPH as deceased by healthcare providers, medical examiners/coroners, or identified by
                                                            death certificates with COVID-19 indicated as the cause of death.
                                                                        </p>
                                                                    ),
                                                                },
                                                            }
                                                        ]

                                                        } />

                                                    </Grid.Row>


                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>



                                        {/* Charactor */}
                                        {/* <center> <Waypoint
                                            onEnter={() => {
                                                setActiveCharacter('COVID-19 by County Characteristics')
                                                console.log(activeCharacter)
                                            }}>
                                        </Waypoint> </center> */}
                                        <Grid id='chara' style={{ paddingBottom: '2em' }}>
                                            <Grid.Row>
                                                <div id='chara' style={sectionStyle2}>
                                                    <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "22pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                        <Header.Content>
                                                            COVID-19 County Disparities
                                    </Header.Content>
                                                    </Header>
                                                </div>
                                            </Grid.Row>
                                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "18pt", paddingTop: 0 }}>

                                                <Header.Subheader style={{ color: '#000000', textAlign: 'left', fontSize: "16pt", paddingTop: 16, paddingBottom: 10, paddingLeft: 0, paddingRight: 0 }}>
                                                    {/* <center> <b style={{ fontSize: "18pt" }}>COVID-19 cases per 100,000 across the population characteristics of all the counties in the United States </b> </center> */}
                                                        COVID-19 affects communities very differently. Underlying medical conditions;
                                                        racial, gender, and age demographics; income levels; and population density are
                                                        all contributing factors that determine the rate of COVID-19 in different counties.
                                                        Some of the many county characteristics that may have a large impact on disparate rates
                                                        of infection are displayed below, with counties divided into quintiles based on each characteristic,
                                                        unless otherwise noted.
                                                        </Header.Subheader>
                                            </Header>
                                        </Grid>
                                        <hr
                                            style={{
                                                color: '#44a0e2',
                                                backgroundColor: '#44a0e2',
                                                height: 5,
                                                width: '100%'
                                            }}
                                        />

                                        <Grid id="cvi" style={{ paddingBottom: '2em' }}>
                                            <Grid.Row>
                                                <div id='cvi' style={{ width: "100%", height: "100%" }}>
                                                    <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "19pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                        <Header.Content>COVID-19 by Community Vulnerability Index</Header.Content>
                                                    </Header>
                                                </div>
                                            </Grid.Row>
                                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "18pt", paddingTop: 1 }}>
                                                <Header.Subheader style={{ color: '#000000', textAlign: 'left', fontSize: "16pt", paddingTop: 1, paddingBottom: 28, paddingLeft: 0, paddingRight: 0 }}>
                                                    The COVID-19 Community Vulnerability Index measures the expected negative impact that a community may face in the context of the COVID-19 epidemic.
                                                    Identifying counties at risk for worse COVID-19 health outcomes can help inform politics and distribution of resources. The COVID-19 Community Vulnerability
                                                    Index (CCVI) was created by Surgo Foundation. CCVI incorporates 34 county characteristics, with six core themes: socioeconomic status, household composition
                                                    and disability, minority status and language, housing type and transportation, epidemiologic factors, healthcare system factors. More information about the
                                                COVID-19 Community Vulnerability Index can be found <a href="https://precisionforcovid.org/us" target="_blank">here</a>.

<br />
                                                    <br />

                                                </Header.Subheader>
                                            </Header>
                                            <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row style={{ paddingTop: "0" }}>
                                                    <Header as='h2' style={{ fontWeight: 600, fontSize: "16pt", lineHeight: "16pt" }}>
                                                        <Header.Content>
                                                            Georgia Community Vulnerability Index Map
                                        </Header.Content>
                                                    </Header>
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: "0", paddingBottom: '1em' }}>
                                                    <svg width="600" height="80">
                                                        {_.map(colorPalette2, (color, i) => {
                                                            return <rect key={i} x={110 + 40 * i} y={40} width="40" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                                                        })}
                                                        <text x={20} y={50} style={{ fontSize: '0.8em' }}>Least vulnerable</text>
                                                        <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest vulnerable</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        {_.map(thresh_chara['cvi'], (splitpoint, i) => {
                                                            return <text key={i} x={105 + 40 * (i)} y={35} style={{ fontSize: '0.7em' }}> {thresh_chara['cvi'][i]}</text>
                                                        })}
                                                    </svg>
                                                    <ComposableMap projection="geoAlbersUsa"
                                                        projectionConfig={{ scale: `${config.scale1}` }}
                                                        width={600}
                                                        height={600}
                                                        data-tip=""
                                                        offsetX={config.offsetX1}
                                                        offsetY={config.offsetY2}>
                                                        <Geographies data-tip='cvi' data-for='cvi' geography={config.url}>
                                                            {({ geographies }) => geographies.map(geo =>
                                                                <Geography
                                                                    key={geo.rsmKey}
                                                                    geography={geo}

                                                                    style={{
                                                                        default: {
                                                                            //  fill: "#ECEFF1",
                                                                            stroke: "#607D8B",
                                                                            strokeWidth: 0.95,
                                                                            outline: "none",
                                                                        },
                                                                        pressed: {
                                                                            outline: "none",
                                                                        }
                                                                    }}
                                                                    onMouseEnter={() => {

                                                                        setCountyFipscvi(geo.properties.COUNTYFP);
                                                                        setCountyNamecvi(fips2county[stateFips + geo.properties.COUNTYFP]);
                                                                        // setTooltipContentcvi(fips2county[stateFips + geo.properties.COUNTYFP] + "'s CCVI: " + dataUs[stateFips + geo.properties.COUNTYFP]['cvi'].toFixed(2));

                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        // setTooltipContent("")
                                                                    }}
                                                                    fill={countyFipscvi === geo.properties.COUNTYFP ? countyColor :
                                                                        ((colorCVI && dataUs[stateFips + geo.properties.COUNTYFP] &&
                                                                            dataUs[stateFips + geo.properties.COUNTYFP]['cvi'] && dataUs[stateFips + geo.properties.COUNTYFP]['cvi'] > 0) ?
                                                                            colorCVI[dataUs[stateFips + geo.properties.COUNTYFP]['cvi']] :
                                                                            (colorCVI && dataUs[stateFips + geo.properties.COUNTYFP] && dataUs[stateFips + geo.properties.COUNTYFP]['cvi'] === 0) ? '#e1dce2' : '#FFFFFF')}
                                                                />
                                                            )}
                                                        </Geographies>
                                                    </ComposableMap>

                                                    {/* <svg width="600" height="80">
                                                        <rect key={0} x={50} y={0} width="20" height="20" style={{ fill: colorPalette[0], strokeWidth: 1, stroke: colorPalette[0] }} />
                                                        <text x={80} y={15} style={{ fontSize: '1em' }}>0 {'-'} 0.53</text>
                                                        <rect key={1} x={200} y={0} width="20" height="20" style={{ fill: colorPalette[1], strokeWidth: 1, stroke: colorPalette[1] }} />
                                                        <text x={230} y={15} style={{ fontSize: '1em' }}>0.53 {'-'} 0.71</text>
                                                        <rect key={2} x={360} y={0} width="20" height="20" style={{ fill: colorPalette[2], strokeWidth: 1, stroke: colorPalette[2] }} />
                                                        <text x={390} y={15} style={{ fontSize: '1em' }}>0.71 {'-'} 0.85</text>

                                                        <rect key={3} x={130} y={40} width="20" height="20" style={{ fill: colorPalette[3], strokeWidth: 1, stroke: colorPalette[3] }} />
                                                        <text x={160} y={55} style={{ fontSize: '1em' }}>0.85 {'-'} 0.94</text>
                                                        <rect key={4} x={280} y={40} width="20" height="20" style={{ fill: colorPalette[4], strokeWidth: 1, stroke: colorPalette[4] }} />
                                                        <text x={310} y={55} style={{ fontSize: '1em' }}>0.94 {'+'}</text>
                                                        
                                                    </svg> */}
                                                </Grid.Row>
                                                <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                    Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                    <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This map shows each Georgia county according to its Community Vulnerability ranking. County rankings are based on CCVI quintile, which ranks each county in one of five groups depending on
                                                                        CCVI score. The ranking classified counties into five groups designed to be of equal size, so that the lowest quintile contains the counties with values in the 0%-20% range for this county
                                                                        characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>
                                            </Grid.Column>
                                            <Grid.Column width={9} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row columns={1}>
                                                    <Grid.Column style={{ paddingTop: 0, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt" }}>
                                                            <Header.Content>
                                                                COVID-19 Case Rate by Community Vulnerability Index
                                                </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 200, right: 50, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label='COVID-19 Cases per 100,000 Residents'
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    { key: "Least vulnerable\n counties", 'value': (data_index['cvi_index']["low20"]['casescumR'] / data_index['cvi_index']["low20"]['casescumR']) * data_index['cvi_index']["low20"]['casescumR'] || 0, 'ez': data_index['cvi_index']["low20"]['county_list'] },
                                                                    { key: "Q2", 'value': (data_index['cvi_index']["Q2"]['casescumR'] / data_index['cvi_index']["Q2"]['casescumR']) * data_index['cvi_index']["Q2"]['casescumR'] || 0, 'ez': data_index['cvi_index']["Q2"]['county_list'] },
                                                                    { key: "Q3", 'value': (data_index['cvi_index']["Q3"]['casescumR'] / data_index['cvi_index']["Q3"]['casescumR']) * data_index['cvi_index']["Q3"]['casescumR'] || 0, 'ez': data_index['cvi_index']["Q3"]['county_list'] },
                                                                    { key: "Q4", 'value': (data_index['cvi_index']["Q4"]['casescumR'] / data_index['cvi_index']["Q4"]['casescumR']) * data_index['cvi_index']["Q4"]['casescumR'] || 0, 'ez': data_index['cvi_index']["Q4"]['county_list'] },
                                                                    { key: "Most vulnerable\n counties", 'value': (data_index['cvi_index']["high20"]['casescumR'] / data_index['cvi_index']["high20"]['casescumR']) * data_index['cvi_index']["high20"]['casescumR'] || 0, 'ez': data_index['cvi_index']["high20"]['county_list'] }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipscvi) ? countyColor : casesColor[1]
                                                                    }
                                                                }}
                                                                // style={{
                                                                //     data: {
                                                                //         fill: casesColor[1]
                                                                //     }
                                                                // }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row columns={1} style={{ paddingTop: "3em" }}>
                                                    <Grid.Column style={{ paddingTop: 15, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt", paddingLeft: "1em" }}>
                                                            <Header.Content>
                                                                COVID-19 Death Rate by Community Vulnerability Index
                                            </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 200, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label='COVID-19 Deaths per 100,000 Residents'
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    { key: "Least vulnerable\n counties", 'value': data_index['cvi_index']["low20"]['deathscumR'] || 0, 'ez': data_index['cvi_index']["low20"]['county_list'] },
                                                                    { key: "Q2", 'value': data_index['cvi_index']["Q2"]['deathscumR'] || 0, 'ez': data_index['cvi_index']["Q2"]['county_list'] },
                                                                    { key: "Q3", 'value': data_index['cvi_index']["Q3"]['deathscumR'] || 0, 'ez': data_index['cvi_index']["Q3"]['county_list'] },
                                                                    { key: "Q4", 'value': data_index['cvi_index']["Q4"]['deathscumR'] || 0, 'ez': data_index['cvi_index']["Q4"]['county_list'] },
                                                                    { key: "Most vulnerable\n counties", 'value': data_index['cvi_index']["high20"]['deathscumR'] || 0, 'ez': data_index['cvi_index']["high20"]['county_list'] }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipscvi) ? countyColor : mortalityColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>

                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row style={{fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '2.8em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                        Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                    </Grid.Row>
                                                    <Grid.Row style={{paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                    <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 100,000 residents by CCVI ranking.
                                                                        The y-axis displays CCVI rankings based on quintiles (groups of 20%). The x-axis displays the average number
                                                                        of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 that occurred in each group of counties ranked by CCVI. The ranking classified counties into five groups designed to be of equal size, so that the lowest
                                                                        quintile contains the counties with values in the 0%-20% range for this county characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic. Q2 indicates counties
                                                                        in the 20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties in the 60%-80% range.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>

                                            </Grid.Column>

                                        </Grid>
                                        <hr
                                            style={{
                                                color: '#44a0e2',
                                                backgroundColor: '#44a0e2',
                                                height: 5,
                                                width: '100%'
                                            }}
                                        />
                                        {/* SI */}
                                        {/* <center> <Waypoint
                                            onEnter={() => {
                                                setActiveCharacter('Residential Segregation Index')
                                                console.log(activeCharacter)
                                            }}>
                                        </Waypoint> </center> */}
                                        <Grid id='si' style={{ paddingBottom: '2em' }} >
                                            <Grid.Row>
                                                <div id='si' style={{ width: "100%", height: "100%" }}>
                                                    <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "19pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                        <Header.Content>
                                                            COVID-19 by Residential Segregation Index
                                    </Header.Content>
                                                    </Header>
                                                </div>

                                            </Grid.Row>

                                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "18pt", paddingTop: 0 }}>

                                                <Header.Subheader style={{ fontFamily: 'lato', color: '#000000', textAlign: 'left', fontSize: "16pt", paddingTop: 0, paddingBottom: 28, paddingLeft: 0, paddingRight: 0 }}>

                                                    Racial residential segregation refers to the phenomenon of racial and ethnic groups living in separate neighborhoods. Residing in separate neighborhoods leads to the experience
                                                    of differing living conditions across racial and ethnic groups. In the United States, African American/Black populations in particular have been forced into living in areas with
                                                    worse housing quality, educational opportunities, and employment prospects through various policies that have promoted residential segregation. The Residential Segregation Index
                                                    is a measure of the degree to which black and white Americans reside in separate neighborhoods, with 100 indicating total separation and 0 indicating total integration.
                                <br></br>
                                In the figures below, we show the case and death rates of COVID-19 across Georgia counties with different levels of residential segregation index.

                <br />
                                                    <br />

                                                </Header.Subheader>
                                            </Header>
                                            <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>

                                                <Grid.Row style={{ paddingLeft: "2", paddingLeft: "1", paddingBottom: '1.5em' }}>
                                                    <Header as='h2' style={{ fontWeight: 600, fontSize: "16pt", lineHeight: "16pt" }}>
                                                        <Header.Content>
                                                            Georgia Residential Segregation Index Map
                                        </Header.Content>
                                                    </Header>
                                                    <svg width="600" height="80">
                                                        {_.map(colorPalette2, (color, i) => {
                                                            return <rect key={i} x={110 + 40 * i} y={40} width="40" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                                                        })}
                                                        <text x={20} y={50} style={{ fontSize: '0.8em' }}>Least segregated</text>
                                                        <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest segregated</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        {_.map(thresh_chara['si'], (splitpoint, i) => {
                                                            return <text key={i} x={105 + 40 * (i)} y={35} style={{ fontSize: '0.7em' }}> {thresh_chara['si'][i]}</text>
                                                        })}
                                                    </svg>
                                                    <ComposableMap projection="geoAlbersUsa"
                                                        projectionConfig={{ scale: `${config.scale1}` }}
                                                        width={600}
                                                        height={600}
                                                        data-tip=""
                                                        offsetX={config.offsetX1}
                                                        offsetY={config.offsetY2}>
                                                        <Geographies data-tip='si' data-for='si' geography={config.url}>
                                                            {({ geographies }) => geographies.map(geo =>
                                                                <Geography
                                                                    key={geo.rsmKey}
                                                                    geography={geo}

                                                                    style={{
                                                                        default: {
                                                                            //  fill: "#ECEFF1",
                                                                            stroke: "#607D8B",
                                                                            strokeWidth: 0.95,
                                                                            outline: "none",
                                                                        },
                                                                        pressed: {
                                                                            outline: "none",
                                                                        }
                                                                    }}
                                                                    onMouseEnter={() => {

                                                                        setCountyFipssi(geo.properties.COUNTYFP);
                                                                        setCountyNamesi(fips2county[stateFips + geo.properties.COUNTYFP]);
                                                                        // setTooltipContentsi(fips2county[stateFips + geo.properties.COUNTYFP] + "'s SI: " + dataUs[stateFips + geo.properties.COUNTYFP]['si'].toFixed(0));

                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        setTooltipContent("")
                                                                    }}
                                                                    fill={countyFipssi === geo.properties.COUNTYFP ? countyColor :
                                                                        ((colorSI && dataUs[stateFips + geo.properties.COUNTYFP] &&
                                                                            dataUs[stateFips + geo.properties.COUNTYFP]['si'] && dataUs[stateFips + geo.properties.COUNTYFP]['si'] > 0) ?
                                                                            colorSI[dataUs[stateFips + geo.properties.COUNTYFP]['si']] :
                                                                            (colorScale && dataUs[stateFips + geo.properties.COUNTYFP] && dataUs[stateFips + geo.properties.COUNTYFP][metric] === 0) ? '#e1dce2' : '#FFFFFF')}
                                                                />
                                                            )}
                                                        </Geographies>
                                                    </ComposableMap>

                                                    {/* <svg width="600" height="80">
                                                        <rect key={0} x={50} y={0} width="20" height="20" style={{ fill: colorPalette[0], strokeWidth: 1, stroke: colorPalette[0] }} />
                                                        <text x={80} y={15} style={{ fontSize: '1em' }}>0 {'-'} 22</text>
                                                        <rect key={1} x={200} y={0} width="20" height="20" style={{ fill: colorPalette[1], strokeWidth: 1, stroke: colorPalette[1] }} />
                                                        <text x={230} y={15} style={{ fontSize: '1em' }}>22 {'-'} 29</text>
                                                        <rect key={2} x={360} y={0} width="20" height="20" style={{ fill: colorPalette[2], strokeWidth: 1, stroke: colorPalette[2] }} />
                                                        <text x={390} y={15} style={{ fontSize: '1em' }}>29 {'-'} 34</text>

                                                        <rect key={3} x={130} y={40} width="20" height="20" style={{ fill: colorPalette[3], strokeWidth: 1, stroke: colorPalette[3] }} />
                                                        <text x={160} y={55} style={{ fontSize: '1em' }}>34 {'-'} 43</text>
                                                        <rect key={4} x={280} y={40} width="20" height="20" style={{ fill: colorPalette[4], strokeWidth: 1, stroke: colorPalette[4] }} />
                                                        <text x={310} y={55} style={{ fontSize: '1em' }}>43 {'+'}</text>
                                                        
                                                    </svg> */}
                                                </Grid.Row>
                                                <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                    Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                    <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This map shows each Georgia county according to its residential segregation ranking.
                                                                        County rankings are based on residential segregation quintile, which ranks each county
                                                                        in one of five groups depending on residential segregation score. The ranking classified counties into five groups designed to be of equal size, so that the lowest quintile contains the counties with values in the 0%-20% range for this county
                                                                        characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>
                                            </Grid.Column>
                                            <Grid.Column width={9} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row columns={1}>
                                                    <Grid.Column style={{ paddingTop: 0, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt" }}>
                                                            <Header.Content>
                                                                COVID-19 Case Rate by Residential Segregation Index
                                                    </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 220, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label='COVID-19 Cases per 100,000 Residents'
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest\n residential segregation", 'value':
                                                                            data_index['s_index']["low20"]['casescumR'] || 0, 'ez': data_index['s_index']["low20"]['county_list']
                                                                    },
                                                                    { key: "Q2", 'value': data_index['s_index']["Q2"]['casescumR'] || 0, 'ez': data_index['s_index']["Q2"]['county_list'] },
                                                                    {
                                                                        key: "Q3", 'value': data_index['s_index']["Q3"]['casescumR']
                                                                            || 0, 'ez': data_index['s_index']["Q3"]['county_list']
                                                                    },
                                                                    { key: "Q4", 'value': data_index['s_index']["Q4"]['casescumR'] || 0, 'ez': data_index['s_index']["Q4"]['county_list'] },
                                                                    {
                                                                        key: "Counties with highest\n residential segregation",
                                                                        'value': data_index['s_index']["high20"]['casescumR'] || 0, 'ez': data_index['s_index']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipssi) ? countyColor : casesColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>
                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row columns={1} style={{ paddingTop: "3em" }}>
                                                    <Grid.Column style={{ paddingTop: 15, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt", paddingLeft: "1em" }}>
                                                            <Header.Content>
                                                                COVID-19 Death Rate by Residential Segregation Index
                                                    </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 220, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label='COVID-19 Deaths per 100,000 Residents'
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest\n residential segregation", 'value':
                                                                            (data_index['s_index']["low20"]['deathscumR'] / data_index['s_index']["Q2"]['deathscumR'])
                                                                            * data_index['s_index']["Q2"]['deathscumR'] || 0, 'ez': data_index['s_index']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': (data_index['s_index']["Q2"]['deathscumR']
                                                                            / data_index['s_index']["Q2"]['deathscumR']) *
                                                                            data_index['s_index']["Q2"]['deathscumR'] || 0, 'ez': data_index['s_index']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': (data_index['s_index']["Q3"]['deathscumR']
                                                                            / data_index['s_index']["Q2"]['deathscumR'])
                                                                            * data_index['s_index']["Q2"]['deathscumR'] || 0, 'ez': data_index['s_index']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': (data_index['s_index']["Q4"]['deathscumR']
                                                                            / data_index['s_index']["Q2"]['deathscumR'])
                                                                            * data_index['s_index']["Q2"]['deathscumR'] || 0, 'ez': data_index['s_index']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest\n residential segregation", 'value': (data_index['s_index']["high20"]['deathscumR']
                                                                            / data_index['s_index']["Q2"]['deathscumR'])
                                                                            * data_index['s_index']["Q2"]['deathscumR'] || 0, 'ez': data_index['s_index']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipssi) ? countyColor : mortalityColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>

                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row style={{fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '3.9em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                        Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                        </Grid.Row>
                                                        <Grid.Row style={{paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                        <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 100,000 residents by residential segregation index.
                                                                        The y-axis displays residential segregation rankings based on quintiles (groups of 20%). The x-axis displays the average number
                                                                        of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 that occurred in each group of counties ranked by residential segregation. The ranking classified counties into five groups designed to be of equal size, so that the lowest
                                                                        quintile contains the counties with values in the 0%-20% range for this county characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic. Q2 indicates counties
                                                                        in the 20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties in the 60%-80% range.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>


                                            </Grid.Column>
                                        </Grid>
                                        <hr
                                            style={{
                                                color: '#44a0e2',
                                                backgroundColor: '#44a0e2',
                                                height: 5,
                                                width: '100%'
                                            }}
                                        />



                                        <Grid id="urbanrural" style={{ paddingBottom: '2em' }}>
                                            <Grid.Row>
                                                <div  style={{ width: "100%", height: "100%" }}>
                                                    <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "19pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                        <Header.Content>COVID-19 by Metropolitan Status</Header.Content>
                                                    </Header>
                                                </div>
                                            </Grid.Row>
                                            <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row style={{ paddingTop: "0" }}>
                                                    <Header as='h2' style={{ fontWeight: 600, fontSize: "16pt", lineHeight: "16pt" }}>
                                                        <Header.Content>
                                                            Georgia Metropolitan Status Map
                                        </Header.Content>
                                                    </Header>
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: "0", paddingBottom: '0em' }}>
                                                    <ComposableMap projection="geoAlbersUsa"
                                                        projectionConfig={{ scale: `${config.scale1}` }}
                                                        width={600}
                                                        height={600}
                                                        data-tip=""
                                                        offsetX={config.offsetX1}
                                                        offsetY={config.offsetY2}>
                                                        <Geographies data-tip='urb' data-for='urb' geography={config.url}>
                                                            {({ geographies }) => geographies.map(geo =>
                                                                <Geography
                                                                    key={geo.rsmKey}
                                                                    geography={geo}

                                                                    style={{
                                                                        default: {
                                                                            //  fill: "#ECEFF1",
                                                                            stroke: "#607D8B",
                                                                            strokeWidth: 0.95,
                                                                            outline: "none",
                                                                        },
                                                                        pressed: {
                                                                            outline: "none",
                                                                        }
                                                                    }}
                                                                    onMouseEnter={() => {

                                                                        setCountyFipsubr(geo.properties.COUNTYFP);
                                                                        setCountyNameubr(fips2county[stateFips + geo.properties.COUNTYFP]);
                                                                        // setTooltipContentubr(fips2county[stateFips + geo.properties.COUNTYFP] + "'s status: " + dataCha[stateFips + geo.properties.COUNTYFP]['_013_Urbanization']);

                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        setTooltipContent("")
                                                                    }}
                                                                    fill={countyFipsubr === geo.properties.COUNTYFP ? countyColor :
                                                                        ((colorUbr && dataCha[stateFips + geo.properties.COUNTYFP] &&
                                                                            dataCha[stateFips + geo.properties.COUNTYFP]['_013_Urbanization_Code'] && dataCha[stateFips + geo.properties.COUNTYFP]['_013_Urbanization_Code'] > 0) ?
                                                                            colorUbr[dataCha[stateFips + geo.properties.COUNTYFP]['_013_Urbanization_Code']] :
                                                                            (colorUbr && dataCha[stateFips + geo.properties.COUNTYFP] && dataCha[stateFips + geo.properties.COUNTYFP]['_013_Urbanization_Code'] === 0) ? '#e1dce2' : '#FFFFFF')}
                                                                />
                                                            )}
                                                        </Geographies>
                                                    </ComposableMap>
                                                    <svg width="600" height="120">
                                                        <rect key={0} x={50} y={40} width="20" height="20" style={{ fill: colorPalette[0], strokeWidth: 1, stroke: colorPalette[0] }} />
                                                        <text x={80} y={55} style={{ fontSize: '0.8em' }}>Remote rural areas</text>
                                                        <rect key={1} x={200} y={40} width="20" height="20" style={{ fill: colorPalette[1], strokeWidth: 1, stroke: colorPalette[1] }} />
                                                        <text x={230} y={55} style={{ fontSize: '0.8em' }}>Rural areas near cities</text>
                                                        <rect key={2} x={360} y={40} width="20" height="20" style={{ fill: colorPalette[2], strokeWidth: 1, stroke: colorPalette[2] }} />
                                                        <text x={390} y={55} style={{ fontSize: '0.8em' }}>Small cities</text>

                                                        <rect key={3} x={50} y={80} width="20" height="20" style={{ fill: colorPalette[3], strokeWidth: 1, stroke: colorPalette[3] }} />
                                                        <text x={80} y={95} style={{ fontSize: '0.8em' }}>Small suburbs</text>
                                                        <rect key={4} x={200} y={80} width="20" height="20" style={{ fill: colorPalette[4], strokeWidth: 1, stroke: colorPalette[4] }} />
                                                        <text x={230} y={95} style={{ fontSize: '0.8em' }}>Large suburbs</text>
                                                        <rect key={5} x={360} y={80} width="20" height="20" style={{ fill: colorPalette[5], strokeWidth: 1, stroke: colorPalette[5] }} />
                                                        <text x={390} y={95} style={{ fontSize: '0.8em' }}>Inner city</text>
                                                    </svg>
                                                </Grid.Row>
                                                <Grid.Row style={{fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                        Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                        </Grid.Row>
                                                        <Grid.Row style={{paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                        <Accordion defaultActiveIndex={1} panels={[

                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This map shows each Georgia county according to its metropolitan status.
                                                                        County rankings are based on metropolitan status, which ranks each county in one of six
                                                                        groups depending on population.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>

                                            </Grid.Column>

                                            <Grid.Column width={9} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row columns={1} style={{ paddingBottom: "2" }}>
                                                    <Grid.Column style={{ paddingTop: 0, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt" }}>
                                                            <Header.Content>
                                                                COVID-19 Cases Rate by Urban-Rural Classification
                                                </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 200, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label={"COVID-19 Cases per 100,000 Residents"}
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Inner city", 'value': data_index['urbanrural']["LargeCentralMetro"]['casescumR'] || 0,
                                                                        'ez': data_index['urbanrural']["LargeCentralMetro"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Large suburbs", 'value': data_index['urbanrural']["LargeFringeMetro"]['casescumR'] || 0,
                                                                        'ez': data_index['urbanrural']["LargeFringeMetro"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Small suburbs", 'value': data_index['urbanrural']["MediumMetro"]['casescumR'] || 0,
                                                                        'ez': data_index['urbanrural']["MediumMetro"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Small cities", 'value': data_index['urbanrural']["SmallMetro"]['casescumR'] || 0,
                                                                        'ez': data_index['urbanrural']["SmallMetro"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Rural areas near\n cities", 'value': data_index['urbanrural']["Micropolitan(Nonmetro)"]['casescumR'] || 0,
                                                                        'ez': data_index['urbanrural']["Micropolitan(Nonmetro)"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Remote rural areas", 'value': data_index['urbanrural']["NonCore(Nonmetro)"]['casescumR'] || 0,
                                                                        'ez': data_index['urbanrural']["NonCore(Nonmetro)"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipsubr) ? countyColor : casesColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>
                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row columns={1} style={{ paddingTop: '4.5em' }}>
                                                    <Grid.Column style={{ paddingTop: 15, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt", paddingLeft: "1em" }}>
                                                            <Header.Content>
                                                                COVID-19 Death Rate by Urban-Rural Classification
                                            </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 200, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label='COVID-19 Deaths per 100,000 Residents'
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Inner city", 'value': data_index['urbanrural']["LargeCentralMetro"]['deathscumR'] || 0,
                                                                        'ez': data_index['urbanrural']["LargeCentralMetro"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Large suburbs", 'value': data_index['urbanrural']["LargeFringeMetro"]['deathscumR'] || 0,
                                                                        'ez': data_index['urbanrural']["LargeFringeMetro"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Small suburbs", 'value': data_index['urbanrural']["MediumMetro"]['deathscumR'] || 0,
                                                                        'ez': data_index['urbanrural']["MediumMetro"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Small cities", 'value': data_index['urbanrural']["SmallMetro"]['deathscumR'] || 0,
                                                                        'ez': data_index['urbanrural']["SmallMetro"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Rural areas near\n cities", 'value': data_index['urbanrural']["Micropolitan(Nonmetro)"]['deathscumR'] || 0,
                                                                        'ez': data_index['urbanrural']["Micropolitan(Nonmetro)"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Remote rural areas", 'value': data_index['urbanrural']["NonCore(Nonmetro)"]['deathscumR'] || 0,
                                                                        'ez': data_index['urbanrural']["NonCore(Nonmetro)"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "18px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipsubr) ? countyColor : mortalityColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>

                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row style={{fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '2.4em', paddingLeft: '4em', paddingRight: '2em' }} centered>
Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
</Grid.Row>
<Grid.Row style={{paddingLeft: '4.9em', paddingRight: '2em' }}>
<Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 100,000 residents by metropolitan status (y-axis).
                                                             Inner city counties have {'>'} 1 million population or contain the entire or large part of the population of the largest principle city.
                                                Large suburban counties have a population {'>'} 1 million, but do not qualify as inner city. Small suburban counties have a population of 250,000-999,999.
                                                Small cities have populations {'<'} 250,000 and are near large cities. Smallest city counties have an urbanized area with population between 10,000-49,999.
                                                Remote rural counties have populations less than 10,000 individuals. This urban-rural classification comes from the National Center for Health Statistics.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>
                                            </Grid.Column>
                                        </Grid>

                                        <hr
                                            style={{
                                                color: '#44a0e2',
                                                backgroundColor: '#44a0e2',
                                                height: 5,
                                                width: '100%'
                                            }}
                                        />

                                        <Grid id="poverty" style={{ paddingBottom: '2em' }}>
                                            <Grid.Row>
                                                <div  style={{ width: "100%", height: "100%" }}>
                                                    <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "19pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                        <Header.Content> COVID-19 by Percentage Population in Poverty</Header.Content>
                                                    </Header>
                                                </div>
                                            </Grid.Row>
                                            <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row style={{ paddingTop: "0" }}>
                                                    <Header as='h2' style={{ fontWeight: 600, fontSize: "16pt", lineHeight: "16pt" }}>
                                                        <Header.Content>
                                                            Georgia Percentage Population in Poverty Map
                                        </Header.Content>
                                                    </Header>
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: "0", paddingBottom: '1em' }}>
                                                    <svg width="600" height="80">
                                                        {_.map(colorPalette2, (color, i) => {
                                                            return <rect key={i} x={110 + 40 * i} y={40} width="40" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                                                        })}
                                                        <text x={20} y={50} style={{ fontSize: '0.8em' }}>Least poverty</text>
                                                        <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest poverty</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        {_.map(thresh_chara['poverty'], (splitpoint, i) => {
                                                            return <text key={i} x={105 + 40 * (i)} y={35} style={{ fontSize: '0.7em' }}> {thresh_chara['poverty'][i]}</text>
                                                        })}
                                                    </svg>
                                                    <ComposableMap projection="geoAlbersUsa"
                                                        projectionConfig={{ scale: `${config.scale1}` }}
                                                        width={600}
                                                        height={600}
                                                        data-tip=""
                                                        offsetX={config.offsetX1}
                                                        offsetY={config.offsetY2}>
                                                        <Geographies data-tip='pov' data-for='pov' geography={config.url}>
                                                            {({ geographies }) => geographies.map(geo =>
                                                                <Geography
                                                                    key={geo.rsmKey}
                                                                    geography={geo}

                                                                    style={{
                                                                        default: {
                                                                            //  fill: "#ECEFF1",
                                                                            stroke: "#607D8B",
                                                                            strokeWidth: 0.95,
                                                                            outline: "none",
                                                                        },
                                                                        pressed: {
                                                                            outline: "none",
                                                                        }
                                                                    }}
                                                                    onMouseEnter={() => {

                                                                        setCountyFipspov(geo.properties.COUNTYFP);
                                                                        setCountyNamepov(fips2county[stateFips + geo.properties.COUNTYFP]);
                                                                        // setTooltipContentpov(fips2county[stateFips + geo.properties.COUNTYFP]);

                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        setTooltipContent("")
                                                                    }}
                                                                    fill={countyFipspov === geo.properties.COUNTYFP ? countyColor :
                                                                        ((colorPov && dataCha[stateFips + geo.properties.COUNTYFP] &&
                                                                            dataCha[stateFips + geo.properties.COUNTYFP]['poverty'] && dataCha[stateFips + geo.properties.COUNTYFP]['poverty'] > 0) ?
                                                                            colorPov[dataCha[stateFips + geo.properties.COUNTYFP]['poverty']] :
                                                                            (colorPov && dataCha[stateFips + geo.properties.COUNTYFP] && dataCha[stateFips + geo.properties.COUNTYFP]['poverty'] === 0) ? '#e1dce2' : '#FFFFFF')}
                                                                />
                                                            )}
                                                        </Geographies>
                                                    </ComposableMap>
                                                    {/* <svg width="600" height="80">
                                                        <rect key={0} x={50} y={0} width="20" height="20" style={{ fill: colorPalette[0], strokeWidth: 1, stroke: colorPalette[0] }} />
                                                        <text x={80} y={15} style={{ fontSize: '1em' }}>0 {'-'} 14.49</text>
                                                        <rect key={1} x={200} y={0} width="20" height="20" style={{ fill: colorPalette[1], strokeWidth: 1, stroke: colorPalette[1] }} />
                                                        <text x={230} y={15} style={{ fontSize: '1em' }}>14.49 {'-'} 19.06</text>
                                                        <rect key={2} x={360} y={0} width="20" height="20" style={{ fill: colorPalette[2], strokeWidth: 1, stroke: colorPalette[2] }} />
                                                        <text x={390} y={15} style={{ fontSize: '1em' }}>19.06 {'-'} 22.34</text>

                                                        <rect key={3} x={130} y={40} width="20" height="20" style={{ fill: colorPalette[3], strokeWidth: 1, stroke: colorPalette[3] }} />
                                                        <text x={160} y={55} style={{ fontSize: '1em' }}>22.34 {'-'} 25.65</text>
                                                        <rect key={4} x={280} y={40} width="20" height="20" style={{ fill: colorPalette[4], strokeWidth: 1, stroke: colorPalette[4] }} />
                                                        <text x={310} y={55} style={{ fontSize: '1em' }}>25.65 {'+'}</text>

                                                    </svg> */}
                                                </Grid.Row>
                                                <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                    Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                    <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This map shows each Georgia county according to its percentage population in poverty.
                                                                        County rankings are based on  percentage of population in poverty, which ranks each county in one of five
                                                                        groups depending on population in poverty. The ranking classified counties into five groups designed to be of equal size, so that the lowest quintile contains the counties with values in the 0%-20% range for this county
                                                                        characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>
                                            </Grid.Column>

                                            <Grid.Column width={9} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row columns={1} style={{ paddingBottom: "2" }}>
                                                    <Grid.Column style={{ paddingTop: 0, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt" }}>
                                                            <Header.Content>
                                                                COVID-19 Case Rate by Percentage of Population in Poverty
                                                </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 305, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label={"COVID-19 Cases per 100,000 Residents"}
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest\n percentage population in poverty", 'value': data_index['poverty']["low20"]['casescumR'] || 0,
                                                                        'ez': data_index['poverty']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': data_index['poverty']["Q2"]['casescumR'] || 0,
                                                                        'ez': data_index['poverty']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': data_index['poverty']["Q3"]['casescumR'] || 0,
                                                                        'ez': data_index['poverty']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': data_index['poverty']["Q4"]['casescumR'] || 0,
                                                                        'ez': data_index['poverty']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest\n percentage  population in poverty", 'value': data_index['poverty']["high20"]['casescumR'] || 0,
                                                                        'ez': data_index['poverty']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipspov) ? countyColor : casesColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>
                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row columns={1} style={{ paddingTop: '3.5em' }}>
                                                    <Grid.Column style={{ paddingTop: 15, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt", paddingLeft: "1em" }}>
                                                            <Header.Content>
                                                                COVID-19 Death Rate by Percentage of Population in Poverty
                                            </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 305, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label='COVID-19 Deaths per 100,000 Residents'
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest\n percentage population in poverty", 'value': data_index['poverty']["low20"]['deathscumR'] || 0,
                                                                        'ez': data_index['poverty']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': data_index['poverty']["Q2"]['deathscumR'] || 0,
                                                                        'ez': data_index['poverty']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': data_index['poverty']["Q3"]['deathscumR'] || 0,
                                                                        'ez': data_index['poverty']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': data_index['poverty']["Q4"]['deathscumR'] || 0,
                                                                        'ez': data_index['poverty']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest\n percentage  population in poverty", 'value': data_index['poverty']["high20"]['deathscumR'] || 0,
                                                                        'ez': data_index['poverty']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "18px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipspov) ? countyColor : mortalityColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>

                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row style={{fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '2.4em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                    Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                    </Grid.Row>
                                                    <Grid.Row style={{paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                    <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 100,000 residents by county ranking on percentage of population in poverty.
                                                                        The y-axis displays percentage population in poverty rankings based on quintiles (groups of 20%). The x-axis displays the average number
                                                                        of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 that occurred in each group of counties ranked by percentage population in poverty. The ranking classified counties into five groups designed to be of equal size, so that the lowest
                                                                        quintile contains the counties with values in the 0%-20% range for this county characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic. Q2 indicates counties
                                                                        in the 20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties in the 60%-80% range.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>
                                            </Grid.Column>
                                        </Grid>

                                        <hr
                                            style={{
                                                color: '#44a0e2',
                                                backgroundColor: '#44a0e2',
                                                height: 5,
                                                width: '100%'
                                            }}
                                        />
                                        <Grid id="black" style={{ paddingBottom: '2em' }}>
                                            <Grid.Row>
                                                <div  style={{ width: "100%", height: "100%" }}>
                                                    <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "19pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                        <Header.Content> COVID-19 by Percentage African American Population</Header.Content>
                                                    </Header>
                                                </div>
                                            </Grid.Row>
                                            <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row style={{ paddingTop: "0" }}>
                                                    <Header as='h2' style={{ fontWeight: 600, fontSize: "16pt", lineHeight: "16pt" }}>
                                                        <Header.Content>
                                                            Georgia Percentage African American Population Map
                                        </Header.Content>
                                                    </Header>
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: "0", paddingBottom: '1em' }}>
                                                    <svg width="600" height="80">
                                                        {_.map(colorPalette2, (color, i) => {
                                                            return <rect key={i} x={110 + 40 * i} y={40} width="40" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                                                        })}
                                                        <text x={18} y={50} style={{ fontSize: '0.8em' }}>Least African</text>
                                                        <text x={18} y={59} style={{ fontSize: '0.8em' }}>American counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest African</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>American counties</text>
                                                        {_.map(thresh_chara['black'], (splitpoint, i) => {
                                                            return <text key={i} x={105 + 40 * (i)} y={35} style={{ fontSize: '0.7em' }}> {thresh_chara['black'][i]}</text>
                                                        })}
                                                    </svg>
                                                    <ComposableMap projection="geoAlbersUsa"
                                                        projectionConfig={{ scale: `${config.scale1}` }}
                                                        width={600}
                                                        height={600}
                                                        data-tip=""
                                                        offsetX={config.offsetX1}
                                                        offsetY={config.offsetY2}>
                                                        <Geographies data-tip='black' data-for='black' geography={config.url}>
                                                            {({ geographies }) => geographies.map(geo =>
                                                                <Geography
                                                                    key={geo.rsmKey}
                                                                    geography={geo}

                                                                    style={{
                                                                        default: {
                                                                            //  fill: "#ECEFF1",
                                                                            stroke: "#607D8B",
                                                                            strokeWidth: 0.95,
                                                                            outline: "none",
                                                                        },
                                                                        pressed: {
                                                                            outline: "none",
                                                                        }
                                                                    }}
                                                                    onMouseEnter={() => {

                                                                        setCountyFipsblack(geo.properties.COUNTYFP);
                                                                        setCountyNameblack(fips2county[stateFips + geo.properties.COUNTYFP]);
                                                                        // setTooltipContentblack(fips2county[stateFips + geo.properties.COUNTYFP]);

                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        setTooltipContent("")
                                                                    }}
                                                                    fill={countyFipsblack === geo.properties.COUNTYFP ? countyColor :
                                                                        ((colorBlack && dataCha[stateFips + geo.properties.COUNTYFP] &&
                                                                            dataCha[stateFips + geo.properties.COUNTYFP]['black'] && dataCha[stateFips + geo.properties.COUNTYFP]['black'] > 0) ?
                                                                            colorBlack[dataCha[stateFips + geo.properties.COUNTYFP]['black']] :
                                                                            (colorBlack && dataCha[stateFips + geo.properties.COUNTYFP] && dataCha[stateFips + geo.properties.COUNTYFP]['black'] === 0) ? '#e1dce2' : '#FFFFFF')}
                                                                />
                                                            )}
                                                        </Geographies>
                                                    </ComposableMap>

                                                </Grid.Row>
                                                <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                    Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                    <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This map shows each Georgia county according to its percentage African American population.
                                                                        County rankings are based on percentage African American population quintile, which ranks each county in one of five
                                                                        groups depending on African American population. The ranking classified counties into five groups designed to be of equal size, so that the lowest quintile contains the counties with values in the 0%-20% range for this county
                                                                        characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>
                                            </Grid.Column>

                                            <Grid.Column width={9} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row columns={1} style={{ paddingBottom: "2" }}>
                                                    <Grid.Column style={{ paddingTop: 0, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt" }}>
                                                            <Header.Content>
                                                                COVID-19 Case Rate by Percentage of African American Population
                                                </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 305, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label={"COVID-19 Cases per 100,000 Residents"}
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest percentage\n African American", 'value': data_index['black']["low20"]['casescumR'] || 0,
                                                                        'ez': data_index['black']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': data_index['black']["Q2"]['casescumR'] || 0,
                                                                        'ez': data_index['black']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': data_index['black']["Q3"]['casescumR'] || 0,
                                                                        'ez': data_index['black']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': data_index['black']["Q4"]['casescumR'] || 0,
                                                                        'ez': data_index['black']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest percentage\n African American", 'value': data_index['black']["high20"]['casescumR'] || 0,
                                                                        'ez': data_index['black']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipsblack) ? countyColor : casesColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>
                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row columns={1} style={{ paddingTop: '3.5em' }}>
                                                    <Grid.Column style={{ paddingTop: 15, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt", paddingLeft: "1em" }}>
                                                            <Header.Content>
                                                                COVID-19 Death Rate by Percentage of African American Population
                                            </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 305, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label='COVID-19 Deaths per 100,000 Residents'
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest percentage\n African American", 'value': data_index['black']["low20"]['deathscumR'] || 0,
                                                                        'ez': data_index['black']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': data_index['black']["Q2"]['deathscumR'] || 0,
                                                                        'ez': data_index['black']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': data_index['black']["Q3"]['deathscumR'] || 0,
                                                                        'ez': data_index['black']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': data_index['black']["Q4"]['deathscumR'] || 0,
                                                                        'ez': data_index['black']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest percentage\n African American", 'value': data_index['black']["high20"]['deathscumR'] || 0,
                                                                        'ez': data_index['black']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "18px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipsblack) ? countyColor : mortalityColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>

                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row style={{fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '2.4em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                    Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                    </Grid.Row>
                                                    <Grid.Row style={{paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                    <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 100,000 residents by percentage African American population ranking.
                                                                        The y-axis displays percentage African American population rankings based on quintiles (groups of 20%). The x-axis displays the average number
                                                                        of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 that occurred in each group of counties ranked by percentage percentage African American. The ranking classified counties into five groups designed to be of equal size, so that the lowest
                                                                        quintile contains the counties with values in the 0%-20% range for this county characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic. Q2 indicates counties
                                                                        in the 20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties in the 60%-80% range.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>

                                            </Grid.Column>
                                        </Grid>

                                        <hr
                                            style={{
                                                color: '#44a0e2',
                                                backgroundColor: '#44a0e2',
                                                height: 5,
                                                width: '100%'
                                            }}
                                        />
                                        <Grid id="hispanic" style={{ paddingBottom: '2em' }}>
                                            <Grid.Row>
                                                <div  style={{ width: "100%", height: "100%" }}>
                                                    <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "19pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                        <Header.Content> COVID-19 by Percentage Hispanic Population</Header.Content>
                                                    </Header>
                                                </div>
                                            </Grid.Row>
                                            <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row style={{ paddingTop: "0" }}>
                                                    <Header as='h2' style={{ fontWeight: 600, fontSize: "16pt", lineHeight: "16pt" }}>
                                                        <Header.Content>
                                                            Georgia Percentage Hispanic Population Map
                                        </Header.Content>
                                                    </Header>
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: "0", paddingBottom: '1em' }}>
                                                    <svg width="600" height="80">
                                                        {_.map(colorPalette2, (color, i) => {
                                                            return <rect key={i} x={110 + 40 * i} y={40} width="40" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                                                        })}
                                                        <text x={12} y={50} style={{ fontSize: '0.8em' }}>Least Hispanic</text>
                                                        <text x={12} y={59} style={{ fontSize: '0.8em' }}>population counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest Hispanic</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>population counties</text>
                                                        {_.map(thresh_chara['hispanic'], (splitpoint, i) => {
                                                            return <text key={i} x={105 + 40 * (i)} y={35} style={{ fontSize: '0.7em' }}> {thresh_chara['hispanic'][i]}</text>
                                                        })}
                                                    </svg>
                                                    <ComposableMap projection="geoAlbersUsa"
                                                        projectionConfig={{ scale: `${config.scale1}` }}
                                                        width={600}
                                                        height={600}
                                                        data-tip=""
                                                        offsetX={config.offsetX1}
                                                        offsetY={config.offsetY2}>
                                                        <Geographies data-tip='his' data-for='his' geography={config.url}>
                                                            {({ geographies }) => geographies.map(geo =>
                                                                <Geography
                                                                    key={geo.rsmKey}
                                                                    geography={geo}

                                                                    style={{
                                                                        default: {
                                                                            //  fill: "#ECEFF1",
                                                                            stroke: "#607D8B",
                                                                            strokeWidth: 0.95,
                                                                            outline: "none",
                                                                        },
                                                                        pressed: {
                                                                            outline: "none",
                                                                        }
                                                                    }}
                                                                    onMouseEnter={() => {

                                                                        setCountyFipshis(geo.properties.COUNTYFP);
                                                                        setCountyNamehis(fips2county[stateFips + geo.properties.COUNTYFP]);
                                                                        // setTooltipContenthis(fips2county[stateFips + geo.properties.COUNTYFP]);

                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        setTooltipContent("")
                                                                    }}
                                                                    fill={countyFipshis === geo.properties.COUNTYFP ? countyColor :
                                                                        ((colorHis && data_cases[stateFips + geo.properties.COUNTYFP] &&
                                                                            data_cases[stateFips + geo.properties.COUNTYFP]['hispanicP'] && data_cases[stateFips + geo.properties.COUNTYFP]['hispanicP'] > 0) ?
                                                                            colorHis[data_cases[stateFips + geo.properties.COUNTYFP]['hispanicP']] :
                                                                            (colorHis && data_cases[stateFips + geo.properties.COUNTYFP] && data_cases[stateFips + geo.properties.COUNTYFP]['hispanicP'] === 0) ? '#e1dce2' : '#FFFFFF')}
                                                                />
                                                            )}
                                                        </Geographies>
                                                    </ComposableMap>
                                                    {/* <svg width="600" height="80">
                                                        <rect key={0} x={50} y={0} width="20" height="20" style={{ fill: colorPalette[0], strokeWidth: 1, stroke: colorPalette[0] }} />
                                                        <text x={80} y={15} style={{ fontSize: '1em' }}>0 {'-'} 2.28</text>
                                                        <rect key={1} x={200} y={0} width="20" height="20" style={{ fill: colorPalette[1], strokeWidth: 1, stroke: colorPalette[1] }} />
                                                        <text x={230} y={15} style={{ fontSize: '1em' }}>2.28 {'-'} 3.86</text>
                                                        <rect key={2} x={360} y={0} width="20" height="20" style={{ fill: colorPalette[2], strokeWidth: 1, stroke: colorPalette[2] }} />
                                                        <text x={390} y={15} style={{ fontSize: '1em' }}>3.86 {'-'} 5.73</text>

                                                        <rect key={3} x={130} y={40} width="20" height="20" style={{ fill: colorPalette[3], strokeWidth: 1, stroke: colorPalette[3] }} />
                                                        <text x={160} y={55} style={{ fontSize: '1em' }}>5.73 {'-'} 8.57</text>
                                                        <rect key={4} x={280} y={40} width="20" height="20" style={{ fill: colorPalette[4], strokeWidth: 1, stroke: colorPalette[4] }} />
                                                        <text x={310} y={55} style={{ fontSize: '1em' }}>8.57 {'+'}</text>

                                                    </svg> */}
                                                </Grid.Row>
                                                <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                    Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                    <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This map shows each Georgia county according to its percentage Hispanic population.
                                                                        County rankings are based on percentage Hispanic population quintile, which ranks each county in one of five
                                                                        groups depending on Hispanic population. The ranking classified counties into five groups designed to be of equal size, so that the lowest quintile contains the counties with values in the 0%-20% range for this county
                                                                        characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>

                                            </Grid.Column>

                                            <Grid.Column width={9} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row columns={1} style={{ paddingBottom: "2" }}>
                                                    <Grid.Column style={{ paddingTop: 0, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt" }}>
                                                            <Header.Content>
                                                                COVID-19 Case Rate by Percentage of African American Population
                                                </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 305, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label={"COVID-19 Cases per 100,000 Residents"}
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest\n percentage Hispanic", 'value': data_index['hispanic']["low20"]['casescumR'] || 0,
                                                                        'ez': data_index['hispanic']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': data_index['hispanic']["Q2"]['casescumR'] || 0,
                                                                        'ez': data_index['hispanic']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': data_index['hispanic']["Q3"]['casescumR'] || 0,
                                                                        'ez': data_index['hispanic']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': data_index['hispanic']["Q4"]['casescumR'] || 0,
                                                                        'ez': data_index['hispanic']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest\n percentage Hispanic", 'value': data_index['hispanic']["high20"]['casescumR'] || 0,
                                                                        'ez': data_index['hispanic']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipshis) ? countyColor : casesColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>
                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row columns={1} style={{ paddingTop: '3.5em' }}>
                                                    <Grid.Column style={{ paddingTop: 15, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt", paddingLeft: "1em" }}>
                                                            <Header.Content>
                                                                COVID-19 Death Rate by Percentage of Hispanic Population
                                            </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 305, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label='COVID-19 Deaths per 100,000 Residents'
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest\n percentage Hispanic", 'value': data_index['hispanic']["low20"]['deathscumR'] || 0,
                                                                        'ez': data_index['hispanic']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': data_index['hispanic']["Q2"]['deathscumR'] || 0,
                                                                        'ez': data_index['hispanic']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': data_index['hispanic']["Q3"]['deathscumR'] || 0,
                                                                        'ez': data_index['hispanic']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': data_index['hispanic']["Q4"]['deathscumR'] || 0,
                                                                        'ez': data_index['hispanic']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest\n percentage Hispanic", 'value': data_index['hispanic']["high20"]['deathscumR'] || 0,
                                                                        'ez': data_index['hispanic']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "18px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipshis) ? countyColor : mortalityColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>

                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row style={{fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '2.4em', paddingLeft: '4em', paddingRight: '2em' }} centered>
Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
</Grid.Row>
<Grid.Row style={{paddingLeft: '4.9em', paddingRight: '2em' }}>
<Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 100,000 residents by percentage Hispanic population ranking.
                                                                        The y-axis displays percentage Hispanic population rankings based on quintiles (groups of 20%). The x-axis displays the average number
                                                                        of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 that occurred in each group of counties ranked by percentage Hispanic population. The ranking classified counties into five groups designed to be of equal size, so that the lowest
                                                                        quintile contains the counties with values in the 0%-20% range for this county characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic. Q2 indicates counties
                                                                        in the 20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties in the 60%-80% range.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>

                                            </Grid.Column>
                                        </Grid>

                                        <hr
                                            style={{
                                                color: '#44a0e2',
                                                backgroundColor: '#44a0e2',
                                                height: 5,
                                                width: '100%'
                                            }}
                                        />
                                        <Grid id="diabetes" style={{ paddingBottom: '2em' }}>
                                            <Grid.Row>
                                                <div  style={{ width: "100%", height: "100%" }}>
                                                    <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "19pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                        <Header.Content> COVID-19 by Percentage of Population with Diabetes</Header.Content>
                                                    </Header>
                                                </div>
                                            </Grid.Row>
                                            <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row style={{ paddingTop: "0" }}>
                                                    <Header as='h2' style={{ fontWeight: 600, fontSize: "16pt", lineHeight: "16pt" }}>
                                                        <Header.Content>
                                                            Georgia Percentage of Population with Diabetes Map
                                        </Header.Content>
                                                    </Header>
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: "0", paddingBottom: '1em' }}>
                                                    <svg width="600" height="80">
                                                        {_.map(colorPalette2, (color, i) => {
                                                            return <rect key={i} x={110 + 40 * i} y={40} width="40" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                                                        })}
                                                        <text x={5} y={50} style={{ fontSize: '0.8em' }}>Least population with </text>
                                                        <text x={5} y={59} style={{ fontSize: '0.8em' }}>diabetes counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest population with</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>diabetes counties</text>
                                                        {_.map(thresh_chara['diabetes'], (splitpoint, i) => {
                                                            return <text key={i} x={105 + 40 * (i)} y={35} style={{ fontSize: '0.7em' }}> {thresh_chara['diabetes'][i]}</text>
                                                        })}
                                                    </svg>
                                                    <ComposableMap projection="geoAlbersUsa"
                                                        projectionConfig={{ scale: `${config.scale1}` }}
                                                        width={600}
                                                        height={600}
                                                        data-tip=""
                                                        offsetX={config.offsetX1}
                                                        offsetY={config.offsetY2}>
                                                        <Geographies data-tip='dia' data-for='dia' geography={config.url}>
                                                            {({ geographies }) => geographies.map(geo =>
                                                                <Geography
                                                                    key={geo.rsmKey}
                                                                    geography={geo}

                                                                    style={{
                                                                        default: {
                                                                            //  fill: "#ECEFF1",
                                                                            stroke: "#607D8B",
                                                                            strokeWidth: 0.95,
                                                                            outline: "none",
                                                                        },
                                                                        pressed: {
                                                                            outline: "none",
                                                                        }
                                                                    }}
                                                                    onMouseEnter={() => {

                                                                        setCountyFipsdia(geo.properties.COUNTYFP);
                                                                        setCountyNamedia(fips2county[stateFips + geo.properties.COUNTYFP]);
                                                                        // setTooltipContentdia(fips2county[stateFips + geo.properties.COUNTYFP]);

                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        setTooltipContent("")
                                                                    }}
                                                                    fill={countyFipsdia === geo.properties.COUNTYFP ? countyColor :
                                                                        ((colorDia && dataCha[stateFips + geo.properties.COUNTYFP] &&
                                                                            dataCha[stateFips + geo.properties.COUNTYFP]['diabetes'] && dataCha[stateFips + geo.properties.COUNTYFP]['diabetes'] > 0) ?
                                                                            colorDia[dataCha[stateFips + geo.properties.COUNTYFP]['diabetes']] :
                                                                            (colorDia && dataCha[stateFips + geo.properties.COUNTYFP] && dataCha[stateFips + geo.properties.COUNTYFP]['diabetes'] === 0) ? '#e1dce2' : '#FFFFFF')}
                                                                />
                                                            )}
                                                        </Geographies>
                                                    </ComposableMap>
                                                    {/* <svg width="600" height="80">
                                                        <rect key={0} x={50} y={0} width="20" height="20" style={{ fill: colorPalette[0], strokeWidth: 1, stroke: colorPalette[0] }} />
                                                        <text x={80} y={15} style={{ fontSize: '1em' }}>0 {'-'} 9.6</text>
                                                        <rect key={1} x={200} y={0} width="20" height="20" style={{ fill: colorPalette[1], strokeWidth: 1, stroke: colorPalette[1] }} />
                                                        <text x={230} y={15} style={{ fontSize: '1em' }}>9.6 {'-'} 11.5</text>
                                                        <rect key={2} x={360} y={0} width="20" height="20" style={{ fill: colorPalette[2], strokeWidth: 1, stroke: colorPalette[2] }} />
                                                        <text x={390} y={15} style={{ fontSize: '1em' }}>11.5 {'-'} 13.2</text>

                                                        <rect key={3} x={130} y={40} width="20" height="20" style={{ fill: colorPalette[3], strokeWidth: 1, stroke: colorPalette[3] }} />
                                                        <text x={160} y={55} style={{ fontSize: '1em' }}>13.2 {'-'} 16.6</text>
                                                        <rect key={4} x={280} y={40} width="20" height="20" style={{ fill: colorPalette[4], strokeWidth: 1, stroke: colorPalette[4] }} />
                                                        <text x={310} y={55} style={{ fontSize: '1em' }}>16.6 {'+'}</text>

                                                    </svg> */}
                                                </Grid.Row>
                                                <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                    Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                    <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This map shows each Georgia county according to its percentage of population with diabetes.
                                                                        County rankings are based on percentage of population with diabetes quintile, which ranks each county in one of five
                                                                        groups depending on population with diabetes. The ranking classified counties into five groups designed to be of equal size, so that the lowest quintile contains the counties with values in the 0%-20% range for this county
                                                                        characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>

                                            </Grid.Column>

                                            <Grid.Column width={9} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row columns={1} style={{ paddingBottom: "2" }}>
                                                    <Grid.Column style={{ paddingTop: 0, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt" }}>
                                                            <Header.Content>
                                                                COVID-19 Case Rate by Percentage of Population with Diabetes
                                                </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 305, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label={"COVID-19 Cases per 100,000 Residents"}
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest percentage\n population with diabetes", 'value': data_index['diabetes']["low20"]['casescumR'] || 0,
                                                                        'ez': data_index['diabetes']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': data_index['diabetes']["Q2"]['casescumR'] || 0,
                                                                        'ez': data_index['diabetes']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': data_index['diabetes']["Q3"]['casescumR'] || 0,
                                                                        'ez': data_index['diabetes']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': data_index['diabetes']["Q4"]['casescumR'] || 0,
                                                                        'ez': data_index['diabetes']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest percentage\n population with diabetes", 'value': data_index['diabetes']["high20"]['casescumR'] || 0,
                                                                        'ez': data_index['diabetes']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipsdia) ? countyColor : casesColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>
                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row columns={1} style={{ paddingTop: '3.5em' }}>
                                                    <Grid.Column style={{ paddingTop: 15, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt", paddingLeft: "1em" }}>
                                                            <Header.Content>
                                                                COVID-19 Death Rate by Percentage of Population with Diabetes
                                            </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 305, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label='COVID-19 Deaths per 100,000 Residents'
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest percentage\n population with diabetes", 'value': data_index['diabetes']["low20"]['deathscumR'] || 0,
                                                                        'ez': data_index['diabetes']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': data_index['diabetes']["Q2"]['deathscumR'] || 0,
                                                                        'ez': data_index['diabetes']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': data_index['diabetes']["Q3"]['deathscumR'] || 0,
                                                                        'ez': data_index['diabetes']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': data_index['diabetes']["Q4"]['deathscumR'] || 0,
                                                                        'ez': data_index['diabetes']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest percentage\n population with diabetes", 'value': data_index['diabetes']["high20"]['deathscumR'] || 0,
                                                                        'ez': data_index['diabetes']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "18px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipsdia) ? countyColor : mortalityColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>

                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row style={{fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '2.4em', paddingLeft: '4em', paddingRight: '2em' }} centered>
Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
</Grid.Row>
<Grid.Row style={{paddingLeft: '4.9em', paddingRight: '2em' }}>
<Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 100,000 residents by county ranking on percentage of population with diabetes.
                                                                        The y-axis displays percentage population with diabetes rankings based on quintiles (groups of 20%). The x-axis displays the average number
                                                                        of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 that occurred in each group of counties ranked by percentage population with diabetes. The ranking classified counties into five groups designed to be of equal size, so that the lowest
                                                                        quintile contains the counties with values in the 0%-20% range for this county characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic. Q2 indicates counties
                                                                        in the 20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties in the 60%-80% range.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>

                                            </Grid.Column>
                                        </Grid>

                                        <hr
                                            style={{
                                                color: '#44a0e2',
                                                backgroundColor: '#44a0e2',
                                                height: 5,
                                                width: '100%'
                                            }}
                                        />
                                        <Grid id="age" style={{ paddingBottom: '2em' }}>
                                            <Grid.Row>
                                                <div style={{ width: "100%", height: "100%" }}>
                                                    <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "19pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                        <Header.Content> COVID-19 by Percentage of Population Age Over 65</Header.Content>
                                                    </Header>
                                                </div>
                                            </Grid.Row>
                                            <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row style={{ paddingTop: "0" }}>
                                                    <Header as='h2' style={{ fontWeight: 600, fontSize: "16pt", lineHeight: "16pt" }}>
                                                        <Header.Content>
                                                            Georgia Percentage of Population Age Over 65 Map
                                        </Header.Content>
                                                    </Header>
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: "0", paddingBottom: '1em' }}>
                                                    <svg width="600" height="80">
                                                        {_.map(colorPalette2, (color, i) => {
                                                            return <rect key={i} x={110 + 40 * i} y={40} width="40" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                                                        })}
                                                        <text x={20} y={50} style={{ fontSize: '0.8em' }}>Low percentage</text>
                                                        <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>High percentage</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        {_.map(thresh_chara['age65over'], (splitpoint, i) => {
                                                            return <text key={i} x={105 + 40 * (i)} y={35} style={{ fontSize: '0.7em' }}> {thresh_chara['age65over'][i]}</text>
                                                        })}
                                                    </svg>
                                                    <ComposableMap projection="geoAlbersUsa"
                                                        projectionConfig={{ scale: `${config.scale1}` }}
                                                        width={600}
                                                        height={600}
                                                        data-tip=""
                                                        offsetX={config.offsetX1}
                                                        offsetY={config.offsetY2}>
                                                        <Geographies data-tip='age' data-for='age' geography={config.url}>
                                                            {({ geographies }) => geographies.map(geo =>
                                                                <Geography
                                                                    key={geo.rsmKey}
                                                                    geography={geo}

                                                                    style={{
                                                                        default: {
                                                                            //  fill: "#ECEFF1",
                                                                            stroke: "#607D8B",
                                                                            strokeWidth: 0.95,
                                                                            outline: "none",
                                                                        },
                                                                        pressed: {
                                                                            outline: "none",
                                                                        }
                                                                    }}
                                                                    onMouseEnter={() => {

                                                                        setCountyFipsa65(geo.properties.COUNTYFP);
                                                                        setCountyNamea65(fips2county[stateFips + geo.properties.COUNTYFP]);
                                                                        // setTooltipContenta65(fips2county[stateFips + geo.properties.COUNTYFP]);

                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        setTooltipContent("")
                                                                    }}
                                                                    fill={countyFipsa65 === geo.properties.COUNTYFP ? countyColor :
                                                                        ((colorA65 && dataCha[stateFips + geo.properties.COUNTYFP] &&
                                                                            dataCha[stateFips + geo.properties.COUNTYFP]['age65over'] && dataCha[stateFips + geo.properties.COUNTYFP]['age65over'] > 0) ?
                                                                            colorA65[dataCha[stateFips + geo.properties.COUNTYFP]['age65over']] :
                                                                            (colorA65 && dataCha[stateFips + geo.properties.COUNTYFP] && dataCha[stateFips + geo.properties.COUNTYFP]['age65over'] === 0) ? '#e1dce2' : '#FFFFFF')}
                                                                />
                                                            )}
                                                        </Geographies>
                                                    </ComposableMap>
                                                    {/* <svg width="600" height="80">
                                                        <rect key={0} x={50} y={0} width="20" height="20" style={{ fill: colorPalette[0], strokeWidth: 1, stroke: colorPalette[0] }} />
                                                        <text x={80} y={15} style={{ fontSize: '1em' }}>0 {'-'} 13.33</text>
                                                        <rect key={1} x={200} y={0} width="20" height="20" style={{ fill: colorPalette[1], strokeWidth: 1, stroke: colorPalette[1] }} />
                                                        <text x={230} y={15} style={{ fontSize: '1em' }}>13.33 {'-'} 15.37</text>
                                                        <rect key={2} x={360} y={0} width="20" height="20" style={{ fill: colorPalette[2], strokeWidth: 1, stroke: colorPalette[2] }} />
                                                        <text x={390} y={15} style={{ fontSize: '1em' }}>15.37 {'-'} 16.86</text>

                                                        <rect key={3} x={130} y={40} width="20" height="20" style={{ fill: colorPalette[3], strokeWidth: 1, stroke: colorPalette[3] }} />
                                                        <text x={160} y={55} style={{ fontSize: '1em' }}>16.86 {'-'} 18.80</text>
                                                        <rect key={4} x={280} y={40} width="20" height="20" style={{ fill: colorPalette[4], strokeWidth: 1, stroke: colorPalette[4] }} />
                                                        <text x={310} y={55} style={{ fontSize: '1em' }}>18.80 {'+'}</text>

                                                    </svg> */}
                                                </Grid.Row>
                                                <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                    Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                    <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This map shows each Georgia county according to its percentage of population over 65 years.
                                                                        County rankings are based on percentage of population over 65 years quintile, which ranks each county in one of five
                                                                        groups depending on population over age 65. The ranking classified counties into five groups designed to be of equal size, so that the lowest quintile contains the counties with values in the 0%-20% range for this county
                                                                        characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>

                                            </Grid.Column>

                                            <Grid.Column width={9} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row columns={1} style={{ paddingBottom: "2" }}>
                                                    <Grid.Column style={{ paddingTop: 0, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt" }}>
                                                            <Header.Content>
                                                                COVID-19 Case Rate by Percentage of Population over the Age 65 Years
                                                </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 305, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label={"COVID-19 Cases per 100,000 Residents"}
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest\n percentage over 65", 'value': data_index['age65over']["low20"]['casescumR'] || 0,
                                                                        'ez': data_index['age65over']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': data_index['age65over']["Q2"]['casescumR'] || 0,
                                                                        'ez': data_index['age65over']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': data_index['age65over']["Q3"]['casescumR'] || 0,
                                                                        'ez': data_index['age65over']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': data_index['age65over']["Q4"]['casescumR'] || 0,
                                                                        'ez': data_index['age65over']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest\n percentage over 65", 'value': data_index['age65over']["high20"]['casescumR'] || 0,
                                                                        'ez': data_index['age65over']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipsa65) ? countyColor : casesColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>
                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row columns={1} style={{ paddingTop: '1.5em' }}>
                                                    <Grid.Column style={{ paddingTop: 15, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt", paddingLeft: "1em" }}>
                                                            <Header.Content>
                                                                COVID-19 Death Rate by Percentage of Population over the Age 65 Years
                                            </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 305, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label='COVID-19 Deaths per 100,000 Residents'
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest\n percentage over 65", 'value': data_index['age65over']["low20"]['deathscumR'] || 0,
                                                                        'ez': data_index['age65over']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': data_index['age65over']["Q2"]['deathscumR'] || 0,
                                                                        'ez': data_index['age65over']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': data_index['age65over']["Q3"]['deathscumR'] || 0,
                                                                        'ez': data_index['age65over']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': data_index['age65over']["Q4"]['deathscumR'] || 0,
                                                                        'ez': data_index['age65over']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest\n percentage over 65", 'value': data_index['age65over']["high20"]['deathscumR'] || 0,
                                                                        'ez': data_index['age65over']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "18px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipsa65) ? countyColor : mortalityColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>

                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row style={{fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '1.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                    Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                    </Grid.Row>
                                                    <Grid.Row style={{paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                    <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 100,000 residents by county ranking on percentage of population over 65 years.
                                                                        The y-axis displays percentage population over 65 rankings based on quintiles (groups of 20%). The x-axis displays the average number
                                                                        of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 that occurred in each group of counties ranked by percentage population over 65 years. The ranking classified counties into five groups designed to be of equal size, so that the lowest
                                                                        quintile contains the counties with values in the 0%-20% range for this county characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic. Q2 indicates counties
                                                                        in the 20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties in the 60%-80% range.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>


                                            </Grid.Column>
                                        </Grid>

                                        <hr
                                            style={{
                                                color: '#44a0e2',
                                                backgroundColor: '#44a0e2',
                                                height: 5,
                                                width: '100%'
                                            }}
                                        />
                                        <Grid id='male' style={{ paddingBottom: '2em' }}>
                                            <Grid.Row>
                                                <div  style={{ width: "100%", height: "100%" }}>
                                                    <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "19pt", paddingTop: '1em', paddingBottom: '1em' }}>
                                                        <Header.Content> COVID-19 by Percentage of Male</Header.Content>
                                                    </Header>
                                                </div>
                                            </Grid.Row>
                                            <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row style={{ paddingTop: "0" }}>
                                                    <Header as='h2' style={{ fontWeight: 600, fontSize: "16pt", lineHeight: "16pt" }}>
                                                        <Header.Content>
                                                            Georgia Percentage of Male Map
                                        </Header.Content>
                                                    </Header>
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: "0", paddingBottom: '1em' }}>
                                                    <svg width="600" height="80">
                                                        {_.map(colorPalette2, (color, i) => {
                                                            return <rect key={i} x={110 + 40 * i} y={40} width="40" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                                                        })}
                                                        <text x={20} y={50} style={{ fontSize: '0.8em' }}>Low percentage</text>
                                                        <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>High percentage</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        {_.map(thresh_chara['male'], (splitpoint, i) => {
                                                            return <text key={i} x={105 + 40 * (i)} y={35} style={{ fontSize: '0.7em' }}> {thresh_chara['male'][i]}</text>
                                                        })}
                                                    </svg>
                                                    <ComposableMap projection="geoAlbersUsa"
                                                        projectionConfig={{ scale: `${config.scale1}` }}
                                                        width={600}
                                                        height={600}
                                                        data-tip=""
                                                        offsetX={config.offsetX1}
                                                        offsetY={config.offsetY2}>
                                                        <Geographies data-tip='male' data-for='male' geography={config.url}>
                                                            {({ geographies }) => geographies.map(geo =>
                                                                <Geography
                                                                    key={geo.rsmKey}
                                                                    geography={geo}

                                                                    style={{
                                                                        default: {
                                                                            //  fill: "#ECEFF1",
                                                                            stroke: "#607D8B",
                                                                            strokeWidth: 0.95,
                                                                            outline: "none",
                                                                        },
                                                                        pressed: {
                                                                            outline: "none",
                                                                        }
                                                                    }}
                                                                    onMouseEnter={() => {

                                                                        setCountyFipsmale(geo.properties.COUNTYFP);
                                                                        setCountyNamemale(fips2county[stateFips + geo.properties.COUNTYFP]);
                                                                        // setTooltipContentmale(fips2county[stateFips + geo.properties.COUNTYFP]);

                                                                    }}
                                                                    onMouseLeave={() => {
                                                                        setTooltipContent("")
                                                                    }}
                                                                    fill={countyFipsmale === geo.properties.COUNTYFP ? countyColor :
                                                                        ((colorMale && dataCha[stateFips + geo.properties.COUNTYFP] &&
                                                                            dataCha[stateFips + geo.properties.COUNTYFP]['male'] && dataCha[stateFips + geo.properties.COUNTYFP]['male'] > 0) ?
                                                                            colorMale[dataCha[stateFips + geo.properties.COUNTYFP]['male']] :
                                                                            (colorMale && dataCha[stateFips + geo.properties.COUNTYFP] && dataCha[stateFips + geo.properties.COUNTYFP]['male'] === 0) ? '#e1dce2' : '#FFFFFF')}
                                                                />
                                                            )}
                                                        </Geographies>
                                                    </ComposableMap>
                                                    {/* <svg width="600" height="80">
                                                        <rect key={0} x={50} y={0} width="20" height="20" style={{ fill: colorPalette[0], strokeWidth: 1, stroke: colorPalette[0] }} />
                                                        <text x={80} y={15} style={{ fontSize: '1em' }}>0 {'-'} 47.73</text>
                                                        <rect key={1} x={200} y={0} width="20" height="20" style={{ fill: colorPalette[1], strokeWidth: 1, stroke: colorPalette[1] }} />
                                                        <text x={230} y={15} style={{ fontSize: '1em' }}>47.73 {'-'} 48.52</text>
                                                        <rect key={2} x={360} y={0} width="20" height="20" style={{ fill: colorPalette[2], strokeWidth: 1, stroke: colorPalette[2] }} />
                                                        <text x={390} y={15} style={{ fontSize: '1em' }}>48.52 {'-'} 49.12</text>

                                                        <rect key={3} x={130} y={40} width="20" height="20" style={{ fill: colorPalette[3], strokeWidth: 1, stroke: colorPalette[3] }} />
                                                        <text x={160} y={55} style={{ fontSize: '1em' }}>49.12 {'-'} 50.11</text>
                                                        <rect key={4} x={280} y={40} width="20" height="20" style={{ fill: colorPalette[4], strokeWidth: 1, stroke: colorPalette[4] }} />
                                                        <text x={310} y={55} style={{ fontSize: '1em' }}>50.11 {'+'}</text>

                                                    </svg> */}
                                                </Grid.Row>
                                                <Grid.Row style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '0.5em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                    Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                </Grid.Row>
                                                <Grid.Row style={{ paddingTop: '0em', paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                    <Accordion defaultActiveIndex={1} panels={[
                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This map shows each Georgia county according to its percentage of male.
                                                                        County rankings are based on percentage male quintile, which ranks each county in one of five
                                                                        groups depending on percentage male. The ranking classified counties into five groups designed to be of equal size, so that the lowest quintile contains the counties with values in the 0%-20% range for this county
                                                                        characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>

                                            </Grid.Column>

                                            <Grid.Column width={9} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                                <Grid.Row columns={1} style={{ paddingBottom: "2" }}>
                                                    <Grid.Column style={{ paddingTop: 0, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt" }}>
                                                            <Header.Content>
                                                                COVID-19 Case Rate by Percentage of Male Population
                                                </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 305, right: 60, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label={"COVID-19 Cases per 100,000 Residents"}
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest\n percentage male population", 'value': data_index['male']["low20"]['casescumR'] || 0,
                                                                        'ez': data_index['male']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': data_index['male']["Q2"]['casescumR'] || 0,
                                                                        'ez': data_index['male']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': data_index['male']["Q3"]['casescumR'] || 0,
                                                                        'ez': data_index['male']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': data_index['male']["Q4"]['casescumR'] || 0,
                                                                        'ez': data_index['male']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest\n percentage male population", 'value': data_index['male']["high20"]['casescumR'] || 0,
                                                                        'ez': data_index['male']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipsmale) ? countyColor : casesColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>
                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row columns={1} style={{ paddingTop: '3.5em' }}>
                                                    <Grid.Column style={{ paddingTop: 15, paddingBottom: 3 }}>
                                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "16pt", lineHeight: "16pt", paddingLeft: "1em" }}>
                                                            <Header.Content>
                                                                COVID-19 Death Rate by Percentage of Male Population
                                            </Header.Content>
                                                        </Header>
                                                        <VictoryChart
                                                            theme={VictoryTheme.material}
                                                            width={730}
                                                            height={270}
                                                            domainPadding={20}
                                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                                            padding={{ left: 305, right: 30, top: 10, bottom: 35 }}
                                                            style={{ fontSize: "14pt" }}
                                                            containerComponent={<VictoryContainer responsive={false} />}
                                                        >
                                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                                            <VictoryAxis dependentAxis
                                                                label='COVID-19 Deaths per 100,000 Residents'
                                                                style={{
                                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' },
                                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                                }} />
                                                            <VictoryBar
                                                                horizontal
                                                                barRatio={0.75}
                                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                                data={[
                                                                    {
                                                                        key: "Counties with lowest\n percentage male population", 'value': data_index['male']["low20"]['deathscumR'] || 0,
                                                                        'ez': data_index['male']["low20"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q2", 'value': data_index['male']["Q2"]['deathscumR'] || 0,
                                                                        'ez': data_index['male']["Q2"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q3", 'value': data_index['male']["Q3"]['deathscumR'] || 0,
                                                                        'ez': data_index['male']["Q3"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Q4", 'value': data_index['male']["Q4"]['deathscumR'] || 0,
                                                                        'ez': data_index['male']["Q4"]['county_list']
                                                                    },
                                                                    {
                                                                        key: "Counties with highest\n percentage male population", 'value': data_index['male']["high20"]['deathscumR'] || 0,
                                                                        'ez': data_index['male']["high20"]['county_list']
                                                                    }
                                                                ]}
                                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "18px", fill: "#000000" }} />}
                                                                style={{
                                                                    data: {
                                                                        fill: ({ datum }) => datum.ez.includes(countyFipsmale) ? countyColor : mortalityColor[1]
                                                                    }
                                                                }}
                                                                x="key"
                                                                y="value"
                                                            />
                                                        </VictoryChart>

                                                    </Grid.Column>
                                                </Grid.Row>

                                                <Grid.Row style={{fontFamily: 'lato', fontSize: 18, color: dataupColor, paddingTop: '2.4em', paddingLeft: '4em', paddingRight: '2em' }} centered>
                                                        Data updated: {dateCur[stateFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}
                                                        </Grid.Row>
                                                        <Grid.Row style={{paddingLeft: '4.9em', paddingRight: '2em' }}>
                                                        <Accordion defaultActiveIndex={1} panels={[

                                                        {
                                                            key: 'acquire-dog',
                                                            title: {
                                                                content: <u style={{ fontFamily: 'lato', fontSize: 18, color: dataupColor }}>About the data</u>,
                                                                icon: 'dropdown',
                                                            },
                                                            content: {
                                                                content: (
                                                                    <p style={{ textAlign: "justify", fontFamily: 'lato', fontSize: 18 }}>
                                                                        This chart shows the number of COVID-19 cases (top chart) and deaths (bottom chart) per 100,000 residents by percentage male population ranking.
                                                                        The y-axis displays percentage male rankings based on quintiles (groups of 20%). The x-axis displays the average number
                                                                        of COVID-19 cases (top chart) or deaths (bottom chart) per 100,000 that occurred in each group of counties ranked by percentage male. The ranking classified counties into five groups designed to be of equal size, so that the lowest
                                                                        quintile contains the counties with values in the 0%-20% range for this county characteristic, and the highest quintile contains counties with values in the 80%-100% range for this county characteristic. Q2 indicates counties
                                                                        in the 20%-40% range, Q3 indicates counties in the 40%-60% range, and Q4 indicates counties in the 60%-80% range.
                                                                    </p>
                                                                ),
                                                            },
                                                        }
                                                    ]

                                                    } />

                                                </Grid.Row>

                                            </Grid.Column>
                                        </Grid>
                                    </Grid>
                                </Grid.Column>

                            </Grid>

                        </div>
                    }
                    <Notes />
                </Container>
                <ReactTooltip id='ga'> <font size="+2"><b >{countyName1.current}</b> </font> <br />
                    <b>Total Cases</b>: {data[stateFips + countyFips1.current]['casescum'] >= 0 ? data[stateFips + countyFips1.current]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFips1.current]['deathscum'] >= 0 ? data[stateFips + countyFips1.current]['deathscum'].toFixed(0) : "N/A"} <br />
                    <b>Total case per 100k</b>: {data[stateFips + countyFips1.current]['casescumR'] >= 0 ? data[stateFips + countyFips]['casescumR'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths per 100k</b>: {data[stateFips + countyFips1.current]['deathscumR'] >= 0 ? data[stateFips + countyFips1.current]['deathscumR'].toFixed(0) : 'N/A'} <br />
                    <b>Last 14-day Cases per 100k</b>: {data[stateFips + countyFips1.current]['casescum14dayR'] >= 0 ? data[stateFips + countyFips1.current]['casescum14dayR'].toFixed(0) : "N/A"} <br />
                    <b>Click to see county-level data.</b> </ReactTooltip>

                <ReactTooltip id='cvi'><font size="+2"><b >{countyNamecvi}</b> </font> <br />
                    <b>CCVI</b>: {dataUs[stateFips + countyFipscvi]['cvi'].toFixed(2)} <br />
                    <b>Total Cases</b>: {data[stateFips + countyFipscvi]['casescum'] >= 0 ? data[stateFips + countyFipscvi]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFipscvi]['deathscum'] >= 0 ? data[stateFips + countyFipscvi]['deathscum'].toFixed(0) : "N/A"} <br />
                </ReactTooltip>

                <ReactTooltip id='si'><font size="+2"><b >{countyNamesi}</b> </font> <br />
                    <b>SI</b>: {dataUs[stateFips + countyFipssi]['si'].toFixed(0)} <br />
                    <b>Total Cases</b>: {data[stateFips + countyFipssi]['casescum'] >= 0 ? data[stateFips + countyFipssi]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFipssi]['deathscum'] >= 0 ? data[stateFips + countyFipssi]['deathscum'].toFixed(0) : "N/A"} <br />
                </ReactTooltip>

                <ReactTooltip id='urb'><font size="+2"><b >{countyNameubr}</b> </font> <br />
                    <b>Metropolitan Status</b>: {dataCha[stateFips + countyFipsubr]['_013_Urbanization']} <br />
                    <b>Total Cases</b>: {data[stateFips + countyFipsubr]['casescum'] >= 0 ? data[stateFips + countyFipsubr]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFipsubr]['deathscum'] >= 0 ? data[stateFips + countyFipsubr]['deathscum'].toFixed(0) : "N/A"} <br />
                </ReactTooltip>

                <ReactTooltip id='black'><font size="+2"><b >{countyNameblack}</b> </font> <br />
                    <b>Percentage African American</b>: {dataCha[stateFips + countyFipsblack]['black'].toFixed(0)} <br />
                    <b>Total Cases</b>: {data[stateFips + countyFipsblack]['casescum'] >= 0 ? data[stateFips + countyFipsblack]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFipsblack]['deathscum'] >= 0 ? data[stateFips + countyFipsblack]['deathscum'].toFixed(0) : "N/A"} <br />
                </ReactTooltip>

                <ReactTooltip id='his'><font size="+2"><b >{countyNamehis}</b> </font> <br />
                    <b>Percentage hispanic</b>: {dataCha[stateFips + countyFipshis]['minority'].toFixed(0)} <br />
                    <b>Total Cases</b>: {data[stateFips + countyFipshis]['casescum'] >= 0 ? data[stateFips + countyFipshis]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFipshis]['deathscum'] >= 0 ? data[stateFips + countyFipshis]['deathscum'].toFixed(0) : "N/A"} <br />
                </ReactTooltip>
                <ReactTooltip id='pov'><font size="+2"><b >{countyNamepov}</b> </font> <br />
                    <b>Percentage population in poverty</b>: {dataCha[stateFips + countyFipspov]['poverty'].toFixed(0)} <br />
                    <b>Total Cases</b>: {data[stateFips + countyFipspov]['casescum'] >= 0 ? data[stateFips + countyFipspov]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFipspov]['deathscum'] >= 0 ? data[stateFips + countyFipspov]['deathscum'].toFixed(0) : "N/A"} <br />
                </ReactTooltip>
                <ReactTooltip id='dia'><font size="+2"><b >{countyNamedia}</b> </font> <br />
                    <b>Percentage population with diabetes</b>: {dataCha[stateFips + countyFipsdia]['diabetes'].toFixed(0)} <br />
                    <b>Total Cases</b>: {data[stateFips + countyFipsdia]['casescum'] >= 0 ? data[stateFips + countyFipsdia]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFipsdia]['deathscum'] >= 0 ? data[stateFips + countyFipsdia]['deathscum'].toFixed(0) : "N/A"} <br />
                </ReactTooltip>
                <ReactTooltip id='age'><font size="+2"><b >{countyNamea65}</b> </font> <br />
                    <b>Percentage population age over 65</b>: {dataCha[stateFips + countyFipsa65]['age65over'].toFixed(0)} <br />
                    <b>Total Cases</b>: {data[stateFips + countyFipsa65]['casescum'] >= 0 ? data[stateFips + countyFipsa65]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFipsa65]['deathscum'] >= 0 ? data[stateFips + countyFipsa65]['deathscum'].toFixed(0) : "N/A"} <br />
                </ReactTooltip>
                <ReactTooltip id='male'><font size="+2"><b >{countyNamemale}</b> </font> <br />
                    <b>Percentage male</b>: {dataCha[stateFips + countyFipsmale]['male'].toFixed(0)} <br />
                    <b>Total Cases</b>: {data[stateFips + countyFipsmale]['casescum'] >= 0 ? data[stateFips + countyFipsmale]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFipsmale]['deathscum'] >= 0 ? data[stateFips + countyFipsmale]['deathscum'].toFixed(0) : "N/A"} <br />
                </ReactTooltip>
                
            </div>
        );
    }
    else {
        return <Loader active inline='centered' />
    }
}