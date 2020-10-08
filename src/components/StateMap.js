import React, { useEffect, Component, useState, createRef, useRef } from 'react'
import { Container, Grid, Breadcrumb, Dropdown, Header, Loader, Divider, Rail, Sticky, Popup, Button, Menu } from 'semantic-ui-react'
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


import { useParams, useHistory } from 'react-router-dom';
import Notes from './Notes';
import ReactTooltip from "react-tooltip";
import _ from 'lodash';
import { scaleQuantile, scaleLinear } from "d3-scale";
import { quantile, ascending } from 'd3';
import fips2county from './fips2county.json'
// import configscounty from "./county_config.json";

import configs from "./state_config.json";

import LazyHero from 'react-lazy-hero';

const casesColor = [
    "#72ABB1",
    "#487f84"
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
    '#7d0707'
];
const colorPalette2 = [
    "#e1dce2",
    "#d3b6cd",
    "#bf88b5",
    "#af5194",
    "#99528c",

];

const colorOut = '#7d0707';
const contextRef = createRef()

const countyColor = '#f2a900';
const stateColor = '#bdbfc1';
const nationColor = '#d9d9d7';
const colorHighlight = '#f2a900';

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
    const [sTate, setsTate] = useState({ activeItem: 'summary' })
    const { activeItem } = sTate
    return (

        <div >
            <Rail internal size='mini' position='left'>
                <Sticky offset={150}>
                    <Menu
                        size='small'
                        compact
                        pointing secondary vertical>
                        <Menu.Item as='a' href="#summary" name='summary' active={props.activeCharacter == 'summary' || activeItem === 'summary'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' href="#re" name='COVID-19 by Race/Ethnicity' active={activeItem === 'COVID-19 by Race/Ethnicity'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' href="#cvi" name='Community Vulnerability Index' active={activeItem === 'Community Vulnerability Index'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' href="#si" name='Residential Segregation Index' active={activeItem === 'Residential Segregation Index'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' href="#urbanrural" name='Characteristics - Metropolitan Status' active={activeItem === 'Characteristics - Metropolitan Status'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' href="#poverty" name='Characteristics - Poverty' active={activeItem === 'Characteristics - Poverty'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' href="#black" name='Characteristics - African American' active={activeItem === 'Characteristics - African American'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' href="#hispanic" name='Characteristics - Hispanic' active={activeItem === 'Characteristics - Hispanic'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' href="#diabetes" name='Characteristics - Diabetes' active={activeItem === 'Characteristics - Diabetes'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' href="#age" name='Characteristics - Age over 65' active={activeItem === 'Characteristics - Age over 65'}
                            onClick={(e, { name }) => { setsTate({ activeItem: name }) }} />
                        <Menu.Item as='a' href="#male" name='Characteristics - Male Percentage' active={activeItem === 'Characteristics - Male Percentage'}
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
                {_.map(props.legendSplit, (splitpoint, i) => {
                    if (props.legendSplit[i] < 1) {
                        return <text key={i} x={57 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit[i].toFixed(1)}</text>
                    }
                    if (props.legendSplit[i] >= 1000) {
                        return <text key={i} x={70 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {(props.legendSplit[i] / 1000).toFixed(1) + "K"}</text>
                    }
                    return <text key={i} x={70 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit[i].toFixed(0)}</text>
                })}

                {_.map(props.legendSplit1, (splitpoint, i) => {
                    if (props.legendSplit1[i] >= 1000) {
                        return <text key={i} x={220 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {(props.legendSplit1[i] / 1000).toFixed(1) + "K"}</text>
                    }
                    return <text key={i} x={220 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit1[i].toFixed(0)}</text>
                })}
                <text x={325} y={15} style={{ fontSize: '0.7em' }}>{props.legendMax}</text>
                <text x={50} y={15} style={{ fontSize: '0.7em' }}> {(props.legendMin / 100).toFixed(0)} </text>
                <rect x={5} y={20} width="25" height="20" style={{ fill: "#FFFFFF", strokeWidth: 0.5, stroke: "#000000" }} />
                <text x={8} y={52} style={{ fontSize: '0.7em' }}> N/A </text>
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
                {_.map(props.legendSplit, (splitpoint, i) => {
                    if (props.legendSplit[i] < 1) {
                        return <text key={i} x={62 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit[i].toFixed(1)}</text>
                    }
                    if (props.legendSplit[i] >= 1000) {
                        return <text key={i} x={72 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {(props.legendSplit[i] / 1000).toFixed(1) + "K"}</text>
                    }
                    return <text key={i} x={72 + 25 * (i)} y={15} style={{ fontSize: '0.7em' }}> {props.legendSplit[i].toFixed(0)}</text>
                })}
                {props.legendMin < 100 ? <text x={55} y={15} style={{ fontSize: '0.7em' }}> {(props.legendMin / 1).toFixed(0)} </text> :
                    <text x={47} y={15} style={{ fontSize: '0.7em' }}> {(props.legendMin / 1).toFixed(0)} </text>
                }



                <text x={224} y={15} style={{ fontSize: '0.7em' }}>{props.legendSplit[colorPalette.length - 1] < 1 ? props.legendSplit[colorPalette.length - 1].toFixed(1)
                    : props.legendSplit[colorPalette.length - 1] > 1000 ?
                        (props.legendSplit[colorPalette.length - 1] / 1000).toFixed(1) + "K" : props.legendSplit[colorPalette.length - 1].toFixed(0)
                }</text>
                <text x={251} y={15} style={{ fontSize: '0.7em' }}>{props.legendMax}</text>
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
    var metric = props.metric;
    var stateFips = props.stateFips;
    var countyFips = props.countyFips;
    var countyname = props.countyname;

    if (props.metric === "casescum14dayR") {
        dataTS = props.data1;

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
                        tickLabels: { fontSize: 25, padding: 5 }
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
                        tickLabels: { fontSize: 25, padding: 5 }
                    }}
                    tickFormat={(t) => new Date(t * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric' })}
                    tickValues={[
                        // 1583035200, 1585713600, 1588305600, 1590984000, 1593576000
                        dataTS['13001'][0].t,
                        dataTS["13001"][32].t,
                        dataTS["13001"][62].t,
                        dataTS["13001"][93].t,
                        dataTS["13001"][123].t,
                        dataTS["13001"][154].t,
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
                />
                {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                    <VictoryAxis dependentAxis tickCount={5}
                        style={{
                            tickLabels: { fontSize: 25, padding: 5 }
                        }}
                        tickFormat={(y) => (y < 1000 ? (Math.round(y, 2) === 0.00 ? " " : y) : (y / 1000 + 'k'))}
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
                    />}
            </VictoryChart>)
    }
}



export default function StateMap(props) {

    // let { stateFips } = useParams();
    const hig = '80';
    const stateFips = '13';
    const [config, setConfig] = useState();
    const [stateName, setStateName] = useState('');

    const [countyFips, setCountyFips] = useState('121');
    const [countyFipscvi, setCountyFipscvi] = useState('121');
    const [countyFipssi, setCountyFipssi] = useState('121');
    const [countyName, setCountyName] = useState('Fulton County');
    const [countyNamecvi, setCountyNamecvi] = useState('Fulton County');
    const [countyNamesi, setCountyNamesi] = useState('Fulton County');
    const history = useHistory();
    const [fips, setFips] = useState('13');
    const [activeCharacter, setActiveCharacter] = useState('')
    const activeClass = 'character-block--active';
    const characterRef = createRef();
    // const [dataFltrd, setDataFltrd] = useState();
    // const [dataFltrdUs, setDataFltrdUs] = useState();

    // const [dataStateFltrd, setDataStateFltrd] = useState();
    // const [dataState, setDataState] = useState();

    const [data, setData] = useState();
    const [dataUs, setDataUs] = useState();
    const [data_index, setIndexData] = useState();

    const [dateCur, setDateCur] = useState();
    const [colorCVI, setColorCVI] = useState();
    const [colorSI, setColorSI] = useState();
    // const [stateLabels, setStateLabels] = useState();
    const [covidMetric, setCovidMetric] = useState({ casesdaily: 'N/A', casesdailymean14: 'N/A', t: 'n/a' });
    const [covidMetric14, setCovidMetric14] = useState({ casesdaily: 'N/A', casesdailymean14: 'N/A', t: 'n/a' });
    const colors = {
        "1": '#024174',
        '2': 'grey'
    };
    const [dataTS, setDataTS] = useState();
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipContentcvi, setTooltipContentcvi] = useState('');
    const [tooltipContentsi, setTooltipContentsi] = useState('');
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

    const metricOptions1 = [{ key: 'cacum', value: 'casescum', text: 'Total COVID-19 cases' },
    { key: 'decum', value: 'deathscum', text: 'Total COVID-19 deaths' },
    { key: 'cacumr', value: 'casescumR', text: 'COVID-19 cases per 100,000 population' },
    { key: 'decumr', value: 'deathscumR', text: 'COVID-19 deaths per 100,000 population' },
    { key: 'cacum14R', value: 'casescum14dayR', text: 'Last 14 days cases per 100,000 population' }];

    const metricOptions2 = [{ key: 'cs', value: 'cs', text: 'Confirmed cases per 100,000 population' },
    { key: 'hp', value: 'hp', text: 'Hospitalizations per 100,000 population' },
    { key: 'ds', value: 'ds', text: 'Deaths per 100,000 population' }];
    const dropdownopt = {
        'casescum': 'Total COVID-19 cases', 'deathscum': 'Total COVID-19 deaths',
        'casescumR': 'COVID-19 cases per 100,000 population', 'deathscumR': 'COVID-19 deaths per 100,000 population'
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
            setStateName(configMatched.name);
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
                    if (metric === 'casescum') {

                        _.map(x, (d, k) => {
                            d.fips = k
                            return d
                        });
                        var temp_Data_metric = [];
                        // retrieve metric data as list
                        _.each(x, d => {
                            if (d.fips.length === 5 && d.fips[0] === '1' && d.fips[1] === '3') {
                                temp_Data_metric.push(d[metric]);
                            }
                        });

                        temp_Data_metric.sort(function (a, b) {
                            return a - b;
                        });
                        var countIqr = 3 * quantile(temp_Data_metric, 0.75) - 2 * quantile(temp_Data_metric, 0.25);
                        // console.log(temp_Data_metric);
                        //   var top10 = _.takeRight(temp_Data_metric,10)[0];

                        //   var belowIqr = _.map(_.filter(temp_Data_metric,
                        //     d => (d<top10
                        //       )),
                        //     d => d);
                        // console.log(belowTop)
                        var belowIqr = _.map(_.filter(temp_Data_metric,
                            d => (d < countIqr
                            )),
                            d => d);

                        var upIqr = _.map(_.filter(temp_Data_metric,
                            d => (d >= countIqr
                            )),
                            d => d);

                        var split = scaleQuantile()
                            .domain(belowIqr).range(colorPalette);
                        var split1 = scaleQuantile()
                            .domain(upIqr).range(colorPalette1);
                        // console.log(split.quantiles())
                        // console.log(split1.quantiles())


                        var thr = [];
                        var thr1 = [];
                        for (i = 0; i < split1.quantiles().length; i++) {
                            thr1[i] = split1.quantiles()[i];
                        }
                        thr1.push(_.takeRight(temp_Data_metric)[0]);

                        for (i = 0; i < split.quantiles().length; i++) {
                            thr[i] = split.quantiles()[i];
                        }
                        thr.push(Math.round(countIqr / 100) * 100);

                        // console.log(thr1);
                        var i;
                        for (i = 0; i < thr.length; i++) {
                            if (thr[i] < 100) {
                                thr[i] = Math.round(thr[i] / 10) * 10;
                            }
                            else {
                                thr[i] = Math.round(thr[i] / 100) * 100;
                            }
                        }
                        for (i = 0; i < thr1.length; i++) {
                            if (thr1[i] < 100) {
                                thr1[i] = Math.floor(thr1[i] / 10) * 10;
                            }
                            else {
                                thr1[i] = Math.floor(thr1[i] / 100) * 100;
                            }

                        }
                        // console.log(thr1)

                        const csUs = {};
                        var indexColor;
                        _.map(belowIqr, d => {
                            if (d >= 0 && d <= thr[0]) {
                                csUs[d] = colorPalette[0];
                            };
                            if (d > thr[0] && d <= thr[1]) {
                                csUs[d] = colorPalette[1];
                            }
                            if (d > thr[1] && d <= thr[2]) {
                                csUs[d] = colorPalette[2];
                            }
                            if (d > thr[2] && d <= thr[3]) {
                                csUs[d] = colorPalette[3];
                            }
                            if (d > thr[3] && d <= thr[4]) {
                                csUs[d] = colorPalette[4];
                            }
                            if (d > thr[4] && d <= thr[5]) {
                                csUs[d] = colorPalette[5];
                            }
                        });

                        _.map(upIqr, d => {
                            if (d > thr[5] && d <= thr1[0]) {
                                csUs[d] = colorPalette1[0];
                            }
                            if (d > thr1[0] && d <= thr1[1]) {
                                csUs[d] = colorPalette1[1];
                            }
                            if (d > thr1[1] && d <= thr1[2]) {
                                csUs[d] = colorPalette1[2];
                            }
                            if (d > thr1[2] && d <= thr1[3]) {
                                csUs[d] = colorPalette1[3];
                            }
                            if (d > thr1[3] && d <= thr1[4]) {
                                csUs[d] = colorPalette1[4];
                            }
                        })
                        let scaleMap = csUs;

                        setColorScale(scaleMap);

                        var max = _.takeRight(temp_Data_metric)[0];
                        var min = temp_Data_metric[0];
                        // console.log(max);
                        if (max > 999) {
                            max = (max / 1000).toFixed(0) + "K";
                            // console.log(max);
                            setLegendMax(max);
                        } else {
                            setLegendMax(max.toFixed(0));

                        }
                        setLegendMin(min.toFixed(0));

                        setLegendSplit(thr);
                        // console.log(thr1[4])
                        setLegendSplit1(thr1.slice(0, 4));
                        setLegendMax1(thr1[4]);

                    }
                    else {
                        _.map(x, (d, k) => {
                            d.fips = k
                            return d
                        });

                        var temp_Data = {};
                        var temp_Data_metric = [];
                        // retrieve metric data as list
                        _.each(x, d => {
                            if (d.fips.length === 5 && d.fips[0] === '1' && d.fips[1] === '3') {
                                temp_Data_metric.push(d[metric]);
                            }
                        });
                        temp_Data[metric] = temp_Data_metric;

                        temp_Data_metric.sort(function (a, b) {
                            return a - b;
                        });
                        // console.log(temp_Data_metric);
                        //   console.log(quantile(temp_Data_metric, 0.75));
                        //   console.log(quantile(temp_Data_metric, 0.25));
                        //   console.log(3*quantile(temp_Data_metric, 0.75)-2*quantile(temp_Data_metric, 0.25));
                        // console.log(6*quantile(temp_Data_metric, 0.75)-5*quantile(temp_Data_metric, 0.25))
                        var countIqr = 6 * quantile(temp_Data_metric, 0.75) - 5 * quantile(temp_Data_metric, 0.25);
                        var rateIqr = 3 * quantile(temp_Data_metric, 0.75) - 2 * quantile(temp_Data_metric, 0.25);
                        var IQR3 = _.map(_.filter(_.map(x, (d, k) => {
                            d.fips = k
                            return d
                        }),
                            d => (metric === 'casescumR' || metric === 'deathscumR' ? d[metric] > 0 && d[metric] < rateIqr &&
                                d.fips.length === 5
                                : d[metric] > 0 && d[metric] < countIqr &&
                                d.fips.length === 5
                            )),
                            d => d[metric]);

                        // console.log(IQR3);

                        const csUs = {};
                        var indexColor;
                        _.map(IQR3, d => {
                            if (metric === 'casescumR' || metric === 'deathscumR' || metric == 'casescum14dayR') { var interV = (rateIqr.toFixed(0)) / colorPalette.length }
                            else { var interV = (countIqr.toFixed(0)) / colorPalette.length }

                            if (metric === 'deathscum' || metric === 'deathscumR') {
                                indexColor = Math.round(interV / 10) * 10;
                            }
                            else {
                                indexColor = Math.round(interV / 100) * 100;
                            }
                            // console.log(indexColor);
                            csUs[d] = colorPalette[Math.floor(d / indexColor)];
                        })

                        _.map(x, d => {
                            if (d[metric] > indexColor * colorPalette.length) {
                                csUs[d[metric]] = colorOut;
                            }
                            if (d[metric] < indexColor * colorPalette.length && d[metric] > 3 * quantile(temp_Data_metric, 0.75) - 2 * quantile(temp_Data_metric, 0.25).toFixed(0)) {
                                csUs[d[metric]] = colorPalette[colorPalette.length - 1];
                            }
                        })
                        let scaleMap = csUs;

                        setColorScale(scaleMap);

                        var max = _.takeRight(temp_Data_metric)[0];
                        var min = temp_Data_metric[0];
                        // console.log(max);
                        if (max > 999) {
                            max = (max / 1000).toFixed(0) + "K";
                            // console.log(max);
                            setLegendMax(max);
                        } else {
                            setLegendMax(max.toFixed(0));

                        }
                        setLegendMin(min.toFixed(0));
                        var split = [];
                        var i = 0;
                        for (i = 0; i < colorPalette.length; i++) {
                            split.push((i + 1) * indexColor);
                        }

                        setLegendSplit(split);
                        // console.log(split);

                    }
                });

            // fetch('/data/timeseries13' + '.json').then(res => res.json())
            //   .then(x => setDataTS(x));
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

            fetch('/data/data.json').then(res => res.json())
                .then(x => {
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
            fetch('/data/index_data.json').then(res => res.json())
                .then(x => {
                    setIndexData(x)
                    // console.log(x)
                });
        }
    }, [stateFips, metric]);



    useEffect(() => {
        if (dataTS && dataTS[stateFips + countyFips]) {
            setCovidMetric(_.takeRight(dataTS[stateFips + countyFips])[0]);
            setCovidMetric14(_.takeRight(dataTS[stateFips + countyFips], 14));
<<<<<<< HEAD
            // console.log(data[stateFips+countyFips])
            //setDateCur(data[stateFips+countyFips])
=======

>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
        }
    }, [dataTS, countyFips])

    if (dataTS && dataUs) {

        return (
<<<<<<< HEAD

            <div>
                <div>
                    <LazyHero 
                    imageSrc={"/Remdesivir-Heparin-Viral-Trap-scaled.jpg"}
                    color={'#E0F5FF'}
                    isCentered={true}
                    opacity={0.8}
                    parallaxOffset={55}
                    //chidren={}
                    style={{
                        height: "450px"
                    }}
                    >
                        <div>
                            <Header.Content style={{
                                height: '10px',
                                width: '400px',
                                fontSize: "18pt",
                                fontWeight: 1000,
                                color: '#0072AE',
                                textAlign: "left",
                                marginTop: '90px',
                                // lineHeight: "65px"
                                }}>
                                    Georgia COVID-19
                            </Header.Content>
                            <Header as="h1" style={{
                                height: '150px',
                                width: '550px',
                                marginRight: '400px',
                                //marginTop: '80px',
                                fontSize: "44pt",
                                fontWeight: 1000,
                                textAlign: "left",
                                lineHeight: "60px"
                            }}>
                                    Health Equity Dashboard
                            </Header>
                                {/* <Grid item xs>
                                    <Header.Content style={{width: 450, color: '#000000', textAlign: 'left', fontSize: "18px", paddingTop: 16, paddingBottom: 28, paddingLeft: 0, paddingRight: 0, lineHeight: '25px'}}>
                                        Containment, mitigation, and response to the COVID-19 pandemic require a coordinated and appropriately-resourced effort driven by granular data that attend to the local context. The Georgia Health Equity dashboard is a tool to dynamically track the burden of cases and deaths across the counties in Georgia.
                                    </Header.Content>
                                    <Header.Content style={{ width: 450, color: '#000000', textAlign: 'left', fontSize: "18px", paddingTop: 16, paddingBottom: 28, paddingLeft: 0, paddingRight: 0, lineHeight: '25px'}}>
                                        We pair data on COVID-19 cases and deaths collected by the Georgia Department of Public Health with county population characteristics to document the differential impact of the epidemic across the state. These data are made available to the public in an effort to inform planning, policy development, and decision making by county health officials and individual residents.
                                    </Header.Content>
                                </Grid> */}
                        </div>
                        
                    </LazyHero>
                    {/* ... */}
                </div>
=======
            <div
                className={`character-block ${activeClass}`}
                id="mycontent"
                ref={characterRef}>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                <AppBar menu='countyReport' />
                <Container style={{ marginTop: '6em', minWidth: '1260px' }}>
                    {config &&
                        <div>
                            <Breadcrumb>
                                {/* <Breadcrumb.Section link onClick={() => history.push('/')}></Breadcrumb.Section>
            <Breadcrumb.Divider /> */}
                                <Breadcrumb.Section active>{stateName}</Breadcrumb.Section>
                                {/* <Breadcrumb.Divider /> */}
                            </Breadcrumb>

                            <Divider id='summary' hidden />

                            <Grid columns={3}>

                                <StickyExampleAdjacentContext activeCharacter />
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Header as='h2' style={{ fontWeight: 400, fontSize: "16pt", paddingRight: 0 }}>
                                            <Header.Content>
                                                Containment, mitigation, and response to the COVID-19 pandemic require a coordinated and appropriately-resourced effort driven by granular data
                                                that attend to the local context. The Georgia Health Equity dashboard is a tool to dynamically track the burden of cases and deaths across the
                                                counties in Georgia. We pair data on COVID-19 cases and deaths collected by the Georgia Department of Public Health with county population characteristics
                                                to document the differential impact of the epidemic across the state. These data are made available to the public in an effort to inform planning, policy
                                                development, and decision making by county health officials and individual residents.
                    <Header.Subheader style={{ fontWeight: 300 }}></Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>


                                <Grid.Column width={7} data-tip='ga' data-for='ga' style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                    <Header as='h2' style={{ fontWeight: 600 }}>
                                        <Header.Content>
                                            <Dropdown
                                                style={{
                                                    background: '#fff',
                                                    fontSize: "17pt",
                                                    fontWeight: 600,
                                                    theme: '#000000',
                                                    width: '520px',
                                                    top: '0em',
                                                    left: '0em',
                                                    text: "Select",
                                                    borderTop: 'none',
                                                    borderLeft: '1px solid #FFFFFF',
                                                    borderRight: 'none',
                                                    borderBottom: '0.9px solid #bdbfc1',
                                                    borderRadius: 0,
                                                    minHeight: '1.0em',
                                                    paddingBottom: '0.2em'
                                                }}
                                                text={metricName}
                                                inline
                                                search

                                                pointing='top'
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
                                    <ComposableMap projection="geoAlbersUsa"
                                        projectionConfig={{ scale: `${config.scale}` }}
                                        width={500}
                                        height={550}
                                        data-tip=""
                                        offsetX={config.offsetX}
                                        offsetY={config.offsetY}>
                                        <Geographies geography={config.url}>
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
                                                        setDelayHandler(setTimeout(() => {
                                                            setCountyFips(geo.properties.COUNTYFP);
                                                            setCountyName(fips2county[stateFips + geo.properties.COUNTYFP]);
                                                            // setTooltipContent('Click to see more county data');
                                                        }, 500))
                                                    }}
                                                    onMouseLeave={() => {
                                                        clearTimeout(delayHandler)
                                                        setTooltipContent("")
                                                    }}
                                                    fill={countyFips === geo.properties.COUNTYFP ? countyColor :
                                                        ((colorScale && dataUs[stateFips + geo.properties.COUNTYFP] &&
                                                            dataUs[stateFips + geo.properties.COUNTYFP][metric] && dataUs[stateFips + geo.properties.COUNTYFP][metric] > 0) ?
                                                            colorScale[dataUs[stateFips + geo.properties.COUNTYFP][metric]] :
                                                            (colorScale && dataUs[stateFips + geo.properties.COUNTYFP] && dataUs[stateFips + geo.properties.COUNTYFP][metric] === 0) ? '#e1dce2' : '#FFFFFF')}
                                                />
                                            )}
                                        </Geographies>
                                    </ComposableMap>
<<<<<<< HEAD

                                    <div style={{ paddingTop: 0, paddingLeft: '1em', paddingRight: '4em' }}>
                                    <Slider
                                        defaultValue={dataTS["13001"].length - 1}
                                        // getAriaValueText={valuetext}
                                        track={false}
                                        aria-labelledby="discrete-slider-restrict"
                                        valueLabelDisplay="off"
                                        marks={[
                                            {
                                                value: 1,
                                                label: new Date((dataTS['13001'][1].t) * 1000).toLocaleDateString(),
                                            },
                                            {
                                                value: 32,
                                                label: new Date((dataTS['13001'][32].t) * 1000).toLocaleDateString(),
                                            },
                                            { 
                                                value: 62,
                                                label: new Date((dataTS['13001'][62].t) * 1000).toLocaleDateString(),
                                            },
                                            {
                                                value: 93,
                                                label: new Date((dataTS['13001'][93].t) * 1000).toLocaleDateString(),
                                            },
                                            {
                                                value: 123,
                                                label: new Date((dataTS['13001'][123].t) * 1000).toLocaleDateString(),
                                            },
                                            {
                                                value: 154,
                                                label: new Date((dataTS['13001'][154].t) * 1000).toLocaleDateString(),
                                            },
                                            {
                                                value: dataTS["13001"].length - 1,
                                                label: new Date((dataTS['13001'][dataTS["13001"].length - 1].t) * 1000).toLocaleDateString(),
                                            },
                                        ]}
                                        step={null}
                                        min={1}
                                        max={dataTS["13001"].length - 1}
                                        onChange={(e, {value}) => {
                                                // setDataUs(dataTS)
                                                // setDateCur(dataTS)
                                                // setCovidMetric(dataTS[stateFips + countyFips][value]);
                                            }
                                        }
                                    />
                                    </div>


=======
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338

                                    <Grid.Row style={{ paddingTop: 0, paddingLeft: '0em', paddingRight: '2em' }} centered>
                                        <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                                            {varNameMap[metric].text}{dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))} . The darker shading indicates a larger number of {varNameMap[metric].name}.
                    </small>
                                    </Grid.Row>

                                </Grid.Column>
                                <Grid.Column width={9} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                    <Header as='h2' style={{ fontWeight: 400, paddingLeft: "2.5" }}>
                                        <Header.Content>
                                            {/* {varGraphPair[metric]['legend'][0]} for <span style={{ color: countyColor }}>{countyName}</span> */}
                                            {varGraphPair[metric]['legend'][0]} for <b>{countyName}</b>
                                            <Header.Subheader style={{ fontWeight: 300 }}>
                                            </Header.Subheader>
                                        </Header.Content>
                                    </Header>
                                    <Grid>
                                        <Grid.Column>
                                            <Grid.Row style={{ paddingLeft: "1.5", paddingTop: "1", paddingBottom: 0 }} centered>

                                                <svg width="630" height='80'>

                                                    <rect x={50} y={12} width="15" height="2" style={{ fill: countyColor, strokeWidth: 1, stroke: countyColor }} />
                                                    <text x={75} y={20} style={{ fontSize: 16 }}>7-day rolling average in {countyName}</text>

                                                    {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                        <rect x={50} y={40} width="15" height="15" style={{ fill: "stateColor", strokeWidth: 1, stroke: stateColor }} /> :
                                                        <rect x={50} y={35} width="15" height="1" style={{ fill: '#007dba', strokeWidth: 1, stroke: '#007dba' }} />}
                                                    {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                        <text x={75} y={52} style={{ fontSize: 16 }}> {varGraphPair[metric]['legend'][0]} </text> :
                                                        <rect x={50} y={35} width="15" height="1" style={{ fill: '#007dba', strokeWidth: 1, stroke: '#007dba' }} />}
                                                    {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                        <text x={250} y={12} style={{ fontSize: 0 }}></text> :
                                                        <text x={75} y={43} style={{ fontSize: 16 }}>7-day rolling average in Georgia</text>}
                                                    {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                        <rect x={0} y={0} width="0" height="0" style={{ fill: 'white', strokeWidth: 0, stroke: 'white' }} /> :
                                                        <rect x={50} y={55} width="15" height="15" style={{ fill: stateColor, strokeWidth: 1, stroke: stateColor }} />}
                                                    {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                        <rect x={0} y={0} width="0" height="0" style={{ fill: 'white', strokeWidth: 0, stroke: 'white' }} /> :
                                                        <text x={75} y={68} style={{ fontSize: 16 }}> {varGraphPair[metric]['legend'][0]} </text>}

                                                </svg>

                                                <ChartGraph
                                                    name={varGraphPair}
                                                    metric={metric}
                                                    stateFips={stateFips}
                                                    countyFips={countyFips}
                                                    data1={covidMetric14}
                                                    data2={dataTS}
                                                    countyname={countyName}
                                                />
                                            </Grid.Row>
                                            <Grid.Row style={{ paddingTop: '2em', paddingLeft: '2.9em', paddingRight: '2.9em' }} centered>
                                                <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                                                    This chart shows the daily number of new confirmed COVID-19 {varNameMap[metric].name} in <b>{countyName}</b> as of {dataTS[stateFips + countyFips][0].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dataTS[stateFips + countyFips][0].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}. The daily number reflects the date the {varNameMap[metric].cat} was first reported to DPH.
                        The vertical bars show the number of new daily {varNameMap[metric].name} while the line shows the 7-day moving average of new daily {varNameMap[metric].name}.
                        </small>
                                            </Grid.Row>
                                        </Grid.Column>
                                    </Grid>
                                </Grid.Column>
                            </Grid>

                            {/* <center> <Divider id="her" hidden style={{ paddingBottom: 50 }} /> </center>
                            <Grid.Column width={8}>
                                <Header as='h2' style={{ fontWeight: "bold", fontSize: "27px", paddingLeft: ".5em" }}>
                                    <Header.Content>
                                        Daily cases in {countyName}
                                        <Header.Subheader style={{ fontWeight: 300 }}>
                                        </Header.Subheader>
                                    </Header.Content>
                                </Header>
                                <svg width="550" height="90">
                                    <rect x={50} y={50} width="15" height="15" style={{ fill: stateColor, strokeWidth: 1, stroke: stateColor }} />
                                    <rect x={50} y={22} width="15" height="1" style={{ fill: countyColor, strokeWidth: 1, stroke: countyColor }} />
                                    <text x={75} y={64} style={{ fontSize: 18 }}> Daily new cases </text>
                                    <text x={75} y={30} style={{ fontSize: 18 }}>7-D Rolling average</text>
                                </svg>
                                <VictoryChart theme={VictoryTheme.material}
                                    containerComponent={
                                        <VictoryVoronoiContainer
                                            responsive={false}
                                            flyoutStyle={{ fill: "black" }}

                                        />
                                    }
                                    width={550}
                                    height={450}
                                    padding={{ left: 40, right: 60, top: 10, bottom: 60 }}>
                                    <VictoryAxis
                                        style={{
                                            tickLabels: { fontSize: 20, padding: 5 }
                                        }}
                                        tickFormat={(t) => new Date(t * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric' })}
                                        tickValues={[
                                            // 1583035200, 1585713600, 1588305600, 1590984000, 1593576000
                                            dataTS['13001'][0].t,
                                            dataTS["13001"][32].t,
                                            dataTS["13001"][62].t,
                                            dataTS["13001"][93].t,
                                            dataTS["13001"][123].t,
                                            dataTS["13001"][154].t,
                                            dataTS["13001"][dataTS["13001"].length - 1].t
                                        ]}
                                    />
                                    <VictoryAxis dependentAxis tickCount={5}
                                        style={{
                                            tickLabels: { fontSize: 17, paddingLeft: '0em' }
                                        }}
                                        tickFormat={(y) => (y < 1000 ? y : (y / 1000 + 'k'))}
                                    />

                                    <VictoryBar style={{ data: { fill: stateColor } }} barWidth={4} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                                        x='t' y='casesdaily'
                                    />
                                    <VictoryLine name="Line" style={{ data: { stroke: countyColor } }} data={dataTS[stateFips + countyFips] ? dataTS[stateFips + countyFips] : dataTS["99999"]}
                                        x='t' y='casesdailymean7'
                                        labels={({ datum }) => `${countyName}\n` +
                                            `Date: ${new Date(datum.t * 1000).toLocaleDateString()}\n` +
                                            `Daily new cases: ${Math.round(datum.casesdaily, 2)}\n` +
                                            `7-d Rolling average of daily new cases: ${Math.round(datum.casesdailymean7, 2)}`
                                        }
                                        labelComponent={
                                            <VictoryTooltip
                                                orientation="top"
                                                style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'white' }}
                                                constrainToVisibleArea
                                                labelComponent={<VictoryLabel dx={-130} textAnchor='start' />}
                                                flyoutStyle={{ fill: "black", fillOpacity: 0.75, stroke: "#FFFFFF", strokeWidth: 0 }}
                                            />
                                        }
                                    />

                                </VictoryChart>
                            </Grid.Column> */}
                            <center> <Divider id='re' hidden style={{ paddingBottom: 50 }} /> </center>
                            <center> <Divider /> </center>
                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "18pt", paddingTop: 30 }}>
                                <Header.Content>
                                    COVID-19 by Race/Ethnicity
                                </Header.Content>
                            </Header>
                            <Grid id='re' style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: 11 }}>
                                    <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt", paddingRight: '2em' }}>
                                            <Header.Content>
                                                Percentage of COVID-19 Cases and Population by Race in Georgia
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
                                            <VictoryAxis style={{
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
                                                    labels={({ datum }) => `Percentage of Cases: ${numberWithCommas(parseFloat(datum.value).toFixed(2) * 100)}%`}
                                                    data={[{ key: "White", 'value': data_cases['13']["whiteC_P"] || 0, 'colors': '1' },
                                                    { key: "Black", 'value': data_cases['13']["blackC_P"] || 0, 'colors': '1' },
                                                    { key: "Hispanic", 'value': data_cases['13']["hispanicC_P"] || 0, 'colors': '1' },
                                                    { key: "Other", 'value': data_cases['13']["otherNHC_P"] || 0, 'colors': '1' }]}
                                                    labelComponent={<VictoryTooltip
                                                        orientation="top"
                                                        style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                        constrainToVisibleArea
                                                        labelComponent={<VictoryLabel dx={-60} textAnchor='start' />}
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
                                                        `Percentage of Population: ${numberWithCommas(parseFloat(datum.value).toFixed(2) * 100)}%`
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

                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt", paddingRight: '2em' }}>
                                            <Header.Content>
                                                Percentage of COVID-19 Deaths and Population by Race in Georgia
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
<<<<<<< HEAD
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
                                                horizontal
                                                barRatio={0.75}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': (data_index['cvi_index']["low20"]['deathsdailymean7R'] / data_index['cvi_index']["Q2"]['deathsdailymean7R']) * data_index['cvi_index']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': (data_index['cvi_index']["Q2"]['deathsdailymean7R'] / data_index['cvi_index']["Q2"]['deathsdailymean7R']) * data_index['cvi_index']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': (data_index['cvi_index']["Q3"]['deathsdailymean7R'] / data_index['cvi_index']["Q2"]['deathsdailymean7R']) * data_index['cvi_index']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': (data_index['cvi_index']["Q4"]['deathsdailymean7R'] / data_index['cvi_index']["Q2"]['deathsdailymean7R']) * data_index['cvi_index']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': (data_index['cvi_index']["high20"]['deathsdailymean7R'] / data_index['cvi_index']["Q2"]['deathsdailymean7R']) * data_index['cvi_index']["Q2"]['deathsdailymean7R'] || 0 }



                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
=======
                                            {/* <VictoryLabel style={{
                                                fontSize: 20, paddingBottom: '0.5em'
                                            }} text={props.title} x={(560) / 2} y={20} textAnchor="middle" /> */}
                                            <VictoryAxis style={{
                                                tickLabels: { fontSize: 18, padding: 2 }
                                            }} />
                                            <VictoryAxis dependentAxis
                                                domain={[0, 1]}
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                style={{
                                                    tickLabels: { fontSize: 18, padding: 2 }
                                                }}
<<<<<<< HEAD
                                                x="key"
                                                y="value"
                                            /> */}
=======
                                                tickFormat={(y) => (y <= 1 ? y * 100 : (y / 1000 + 'k'))} />
                                            <VictoryLegend x={80} y={40}
                                                orientation="horizontal"
                                                gutter={1}
                                                // style={{ border: { stroke: "black" } }}
                                                data={[
                                                    { name: 'Percentage of Deaths', symbol: { fill: colors['1'], type: "square" } },
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
                                                    labels={({ datum }) => `Percentage of Deaths: ${numberWithCommas(parseFloat(datum.value).toFixed(2) * 100)}%`}
                                                    data={[{ key: "White", 'value': data_deaths['13']["whiteC_P"] || 0, 'colors': '1' },
                                                    { key: "Black", 'value': data_deaths['13']["blackC_P"] || 0, 'colors': '1' },
                                                    { key: "Hispanic", 'value': data_deaths['13']["hispanicC_P"] || 0, 'colors': '1' },
                                                    { key: "Other", 'value': data_deaths['13']["otherNHC_P"] || 0, 'colors': '1' }]}
                                                    labelComponent={<VictoryTooltip
                                                        orientation="top"
                                                        style={{ fontWeight: 600, fontFamily: 'lato', fontSize: 14, fill: 'black' }}
                                                        constrainToVisibleArea
                                                        labelComponent={<VictoryLabel dx={-60} textAnchor='start' />}
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
                                                        `Percentage of Population: ${numberWithCommas(parseFloat(datum.value).toFixed(2) * 100)}%`
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
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                        </VictoryChart>

                                        {/* <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>

                                                <br />
                                                <b>Average Daily COVID-19 Cases per 100,000</b>
                                            </center>
                                        </Header.Content> */}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid>
                                <Grid.Row columns={2} style={{ paddingBottom: 7 }}>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 132 }}>
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This chart shows the percentage of cases and percentage of the population by race and ethnicity for <b>Georgia</b>. The chart excludes data from {datades_cases['13']['age4catPmiss'].toFixed(2)}% of confirmed cases who were missing information on race/ethnicity. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>

                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 33 }}>
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This chart shows the percentage of deaths and percentage of the population by race and ethnicity for <b>Georgia</b>. The chart excludes data from {datades_deaths['13']['race_3Pmiss'].toFixed(2)}% of confirmed deaths who were missing information on race/ethnicity. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>





                            <center> <Divider id="cvi" hidden style={{ paddingBottom: 50 }} /> </center>
                            {/* cvi */}
                            <center> <Divider /> </center>
                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "18pt", paddingTop: 30 }}>

                                <Header.Content>
                                    COVID-19 by Community Vulnerability Index
                                <Header.Subheader style={{ color: '#000000', textAlign: 'left', fontSize: "16pt", paddingTop: 16, paddingBottom: 28, paddingLeft: 0, paddingRight: 0 }}>

                                        Some communities are limited in their ability to prevent, manage, and mitigate the spread of a pandemic disease, and its economic and social impacts,
                                        rendering them more vulnerable to COVID-19 than others. The COVID-19 Community vulnerability index (CCVI) incorporates 34 county characteristics that make a
                                        community vulnerable to the COVID-19 pandemic. These characteristics include sociodemographic factors, risk factors specific to COVID-19, and indicators of the
                                        capacity of public health systems.

                <br />
                                        <br />

                                    </Header.Subheader>
                                </Header.Content>
                            </Header>
                            <Grid columns={16}>
                                <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>
                                    <Grid.Row style={{ paddingTop: "0" }}>
                                        <Header as='h2' style={{ fontWeight: 600, fontSize: "16pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                Georgia Community Vulnerability Index Map
                                        </Header.Content>
                                        </Header>
                                    </Grid.Row>
                                    <Grid.Row data-tip='cvi' data-for='cvi' style={{ paddingTop: "0", paddingBottom: '1em' }}>
                                        <svg width="320" height="80">
                                            {_.map(colorPalette2, (color, i) => {
                                                return <rect key={i} x={110 + 20 * i} y={40} width="20" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                                            })}
                                            <text x={20} y={50} style={{ fontSize: '0.8em' }}>Least vulnerable</text>
                                            <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                            <text x={140 + 20 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest vulnerable</text>
                                            <text x={140 + 20 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>counties</text>

                                        </svg>
                                        <ComposableMap projection="geoAlbersUsa"
                                            projectionConfig={{ scale: `${config.scale1}` }}
                                            width={600}
                                            height={600}
                                            data-tip=""
                                            offsetX={config.offsetX}
                                            offsetY={config.offsetY1}>
                                            <Geographies geography={config.url}>
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
                                                            setTooltipContentcvi(fips2county[stateFips + geo.properties.COUNTYFP] + "'s CCVI: " + dataUs[stateFips + geo.properties.COUNTYFP]['cvi'].toFixed(2));

                                                        }}
                                                        onMouseLeave={() => {
                                                            setTooltipContent("")
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
                                    </Grid.Row>
                                    <Grid.Row style={{ paddingTop: 0, paddingLeft: '0em', paddingRight: '2em' }} centered>
                                        <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                                            This map shows each Georgia county according to its Community Vulnerability ranking.
                                            County rankings are based on CCVI quintile, which ranks each county in one of five
                                            groups depending on CCVI score.
                                            </small>
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
                                                padding={{ left: 200, right: 30, top: 10, bottom: 35 }}
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
                                                        { key: "Least vulnerable\n counties", 'value': (data_index['cvi_index']["low20"]['casesdailymean7R'] / data_index['cvi_index']["low20"]['casesdailymean7R']) * data_index['cvi_index']["low20"]['casesdailymean7R'] || 0, 'ez': data_index['cvi_index']["low20"]['county_list'] },
                                                        { key: "Q2", 'value': (data_index['cvi_index']["Q2"]['casesdailymean7R'] / data_index['cvi_index']["Q2"]['casesdailymean7R']) * data_index['cvi_index']["Q2"]['casesdailymean7R'] || 0, 'ez': data_index['cvi_index']["Q2"]['county_list'] },
                                                        { key: "Q3", 'value': (data_index['cvi_index']["Q3"]['casesdailymean7R'] / data_index['cvi_index']["Q3"]['casesdailymean7R']) * data_index['cvi_index']["Q3"]['casesdailymean7R'] || 0, 'ez': data_index['cvi_index']["Q3"]['county_list'] },
                                                        { key: "Q4", 'value': (data_index['cvi_index']["Q4"]['casesdailymean7R'] / data_index['cvi_index']["Q4"]['casesdailymean7R']) * data_index['cvi_index']["Q4"]['casesdailymean7R'] || 0, 'ez': data_index['cvi_index']["Q4"]['county_list'] },
                                                        { key: "Most vulnerable\n counties", 'value': (data_index['cvi_index']["high20"]['casesdailymean7R'] / data_index['cvi_index']["high20"]['casesdailymean7R']) * data_index['cvi_index']["high20"]['casesdailymean7R'] || 0, 'ez': data_index['cvi_index']["high20"]['county_list'] }
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
                                    <Grid.Row style={{ paddingTop: '0.1em', paddingLeft: '2.9em', paddingRight: '0.1em' }} centered>
                                        <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                                            This chart shows the number of COVID-19 cases per 100,000 residents as of {dataTS[stateFips + countyFips][0].todaydate === 'n/a' ? 'N/A' :
                                                (new Date(dataTS[stateFips + countyFips][0].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))} by CCVI ranking.
                                                    Counties in the highest 20% are the most vulnerable. The y-axis displays CCVI rankings based on quintiles (groups of 20%). The x-axis displays the average number
                                                    of COVID-19 cases per 100,000 that occurred in each group of counties ranked by CCVI.
                        </small>
                                    </Grid.Row>
                                    <Grid.Row columns={1}>
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
                                                padding={{ left: 200, right: 30, top: 10, bottom: 35 }}
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
                                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                    data={[
                                                        { key: "Least vulnerable\n counties", 'value': data_index['cvi_index']["low20"]['deathsdailymean7R'] || 0, 'ez': data_index['cvi_index']["low20"]['county_list'] },
                                                        { key: "Q2", 'value': data_index['cvi_index']["Q2"]['deathsdailymean7R'] || 0, 'ez': data_index['cvi_index']["Q2"]['county_list'] },
                                                        { key: "Q3", 'value': data_index['cvi_index']["Q3"]['deathsdailymean7R'] || 0, 'ez': data_index['cvi_index']["Q3"]['county_list'] },
                                                        { key: "Q4", 'value': data_index['cvi_index']["Q4"]['deathsdailymean7R'] || 0, 'ez': data_index['cvi_index']["Q4"]['county_list'] },
                                                        { key: "Most vulnerable\n counties", 'value': data_index['cvi_index']["high20"]['deathsdailymean7R'] || 0, 'ez': data_index['cvi_index']["high20"]['county_list'] }
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
                                    <Grid.Row style={{ paddingTop: '0.1em', paddingLeft: '2.9em', paddingRight: '0.1em' }} centered>
                                        <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                                            This chart shows the number of COVID-19 deaths per 100,000 residents as of {dataTS[stateFips + countyFips][0].todaydate === 'n/a' ? 'N/A' :
                                                (new Date(dataTS[stateFips + countyFips][0].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))} by CCVI ranking.
                                                    The y-axis displays CCVI rankings based on quintiles (groups of 20%). The x-axis displays the average number of COVID-19 deaths per 100,000 that occurred in each
                                                    group of counties ranked by CCVI.
                        </small>
                                    </Grid.Row>
                                </Grid.Column>
                            </Grid>

                            {/* SI */}
                            <center> <Divider id='si' hidden style={{ paddingBottom: 50 }} /> </center>
                            <center> <Divider /> </center>
                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "18pt", paddingTop: 30 }}>
                                <Header.Content>
                                    COVID-19 by Residential Segregation Index
                                <Header.Subheader style={{ color: '#000000', textAlign: 'left', fontSize: "16pt", paddingTop: 16, paddingBottom: 28, paddingLeft: 0, paddingRight: 0 }}>

                                        Residential segregation is a key factor responsible for the disproportionate impact of COVID-19 on different communities in the US.
                                        It allows for social conditions that facilitate transmission and vulnerability to the effects of pandemic to be concentrated in
                                        geographically defined areas. This results in the entire neighborhood being more exposed to the virus than others and more
                                        vulnerable to its effects and limited quality of care. In the figures below, we show the severity of COVID-19 across
                                        Georgia counties with different levels of residential segregation index.

                <br />
                                        <br />

                                    </Header.Subheader>
                                </Header.Content>
                            </Header>

                            <Grid columns={16}>
                                <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>

                                    <Grid.Row data-tip='si' data-for='si' style={{ paddingLeft: "2", paddingLeft: "1", paddingBottom: '1.5em' }}>
                                        <Header as='h2' style={{ fontWeight: 600, fontSize: "16pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                Georgia Residential Segregation Index Map
                                        </Header.Content>
                                        </Header>
<<<<<<< HEAD
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={1030}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 300, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
                                                horizontal
                                                barRatio={0.75}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': (data_index['s_index']["low20"]['casesdailymean7R'] / data_index['s_index']["low20"]['casesdailymean7R']) * data_index['s_index']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': (data_index['s_index']["Q2"]['casesdailymean7R'] / data_index['s_index']["low20"]['casesdailymean7R']) * data_index['s_index']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': (data_index['s_index']["Q3"]['casesdailymean7R'] / data_index['s_index']["low20"]['casesdailymean7R']) * data_index['s_index']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': (data_index['s_index']["Q4"]['casesdailymean7R'] / data_index['s_index']["low20"]['casesdailymean7R']) * data_index['s_index']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': (data_index['s_index']["high20"]['casesdailymean7R'] / data_index['s_index']["low20"]['casesdailymean7R']) * data_index['s_index']["low20"]['casesdailymean7R'] || 0 }
=======
                                        <svg width="500" height="80">
                                            {_.map(colorPalette2, (color, i) => {
                                                return <rect key={i} x={110 + 20 * i} y={40} width="20" height="20" style={{ fill: color, strokeWidth: 1, stroke: color }} />
                                            })}
                                            <text x={20} y={50} style={{ fontSize: '0.8em' }}>Least vulnerable</text>
                                            <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                            <text x={140 + 20 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest vulnerable</text>
                                            <text x={140 + 20 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                            <rect x={140 + 20 * (colorPalette2.length - 1) + 100} y={40} width="25" height="20" style={{ fill: "#FFFFFF", strokeWidth: 0.5, stroke: "#000000" }} />
                                            <text x={140 + 20 * (colorPalette2.length - 1) + 130} y={52} style={{ fontSize: '0.7em' }}> N/A </text>

                                        </svg>
                                        <ComposableMap projection="geoAlbersUsa"
                                            projectionConfig={{ scale: `${config.scale1}` }}
                                            width={600}
                                            height={600}
                                            data-tip=""
                                            offsetX={config.offsetX}
                                            offsetY={config.offsetY2}>
                                            <Geographies geography={config.url}>
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
                                                            setTooltipContentsi(fips2county[stateFips + geo.properties.COUNTYFP] + "'s SI: " + dataUs[stateFips + geo.properties.COUNTYFP]['si'].toFixed(0));

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
                                    </Grid.Row>
                                    <Grid.Row style={{ paddingTop: 0, paddingLeft: '0em', paddingRight: '2em' }} centered>
                                        <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                                            This map shows each Georgia county according to its residential segregation ranking.
                                            County rankings are based on residential segregation quintile, which ranks each county
                                            in one of five groups depending on residential segregation score.
                                            </small>
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
                                                padding={{ left: 220, right: 30, top: 10, bottom: 35 }}
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
                                                                data_index['s_index']["low20"]['casesdailymean7R'] || 0, 'ez': data_index['s_index']["low20"]['county_list']
                                                        },
                                                        { key: "Q2", 'value': data_index['s_index']["Q2"]['casesdailymean7R'] || 0, 'ez': data_index['s_index']["Q2"]['county_list'] },
                                                        {
                                                            key: "Q3", 'value': data_index['s_index']["Q3"]['casesdailymean7R']
                                                                || 0, 'ez': data_index['s_index']["Q3"]['county_list']
                                                        },
                                                        { key: "Q4", 'value': data_index['s_index']["Q4"]['casesdailymean7R'] || 0, 'ez': data_index['s_index']["Q4"]['county_list'] },
                                                        {
                                                            key: "Counties with highest\n residential segregation",
                                                            'value': data_index['s_index']["high20"]['casesdailymean7R'] || 0, 'ez': data_index['s_index']["high20"]['county_list']
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
                                    <Grid.Row style={{ paddingTop: '0.1em', paddingLeft: '2.9em', paddingRight: '0.1em' }} centered>
                                        <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                                            This chart shows the number of COVID-19 cases per 100,000 residents as of {dataTS[stateFips + countyFips][0].todaydate === 'n/a' ? 'N/A' :
                                                (new Date(dataTS[stateFips + countyFips][0].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))} by residential segregation index.
                                                    The y-axis displays residential segregation rankings based on quintiles (groups of 20%). The x-axis displays the average number of COVID-19 cases per 100,000 that occurred in each
                                                    group of counties ranked by residential segregation.
                        </small>
                                    </Grid.Row>
                                    <Grid.Row columns={1}>
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
                                                padding={{ left: 220, right: 30, top: 10, bottom: 35 }}
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
                                                    labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                    data={[
                                                        {
                                                            key: "Counties with lowest\n residential segregation", 'value':
                                                                (data_index['s_index']["low20"]['deathsdailymean7R'] / data_index['s_index']["Q2"]['deathsdailymean7R'])
                                                                * data_index['s_index']["Q2"]['deathsdailymean7R'] || 0, 'ez': data_index['s_index']["low20"]['county_list']
                                                        },
                                                        {
                                                            key: "Q2", 'value': (data_index['s_index']["Q2"]['deathsdailymean7R']
                                                                / data_index['s_index']["Q2"]['deathsdailymean7R']) *
                                                                data_index['s_index']["Q2"]['deathsdailymean7R'] || 0, 'ez': data_index['s_index']["Q2"]['county_list']
                                                        },
                                                        {
                                                            key: "Q3", 'value': (data_index['s_index']["Q3"]['deathsdailymean7R']
                                                                / data_index['s_index']["Q2"]['deathsdailymean7R'])
                                                                * data_index['s_index']["Q2"]['deathsdailymean7R'] || 0, 'ez': data_index['s_index']["Q3"]['county_list']
                                                        },
                                                        {
                                                            key: "Q4", 'value': (data_index['s_index']["Q4"]['deathsdailymean7R']
                                                                / data_index['s_index']["Q2"]['deathsdailymean7R'])
                                                                * data_index['s_index']["Q2"]['deathsdailymean7R'] || 0, 'ez': data_index['s_index']["Q4"]['county_list']
                                                        },
                                                        {
                                                            key: "Counties with highest\n residential segregation", 'value': (data_index['s_index']["high20"]['deathsdailymean7R']
                                                                / data_index['s_index']["Q2"]['deathsdailymean7R'])
                                                                * data_index['s_index']["Q2"]['deathsdailymean7R'] || 0, 'ez': data_index['s_index']["high20"]['county_list']
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
                                    <Grid.Row style={{ paddingTop: '0.1em', paddingLeft: '2.9em', paddingRight: '0.1em' }} centered>
                                        <small style={{ fontWeight: 300, fontSize: 18, color: 'black' }} align="justify">
                                            This chart shows the number of COVID-19 deaths per 100,000 residents as of {dataTS[stateFips + countyFips][0].todaydate === 'n/a' ? 'N/A' :
                                                (new Date(dataTS[stateFips + countyFips][0].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))} by residential segregation index.
                                                    The y-axis displays residential segregation rankings based on quintiles (groups of 20%). The x-axis displays the average number of COVID-19 deaths per 100,000 that occurred in each
                                                    group of counties ranked by residential segregation.
                        </small>
                                    </Grid.Row>

                                </Grid.Column>
                            </Grid>





                            {/* Charactor */}
                            <center> <Divider id="urbanrural" hidden style={{ paddingBottom: 50 }} /> </center>
                            <center> <Divider /> </center>
                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "18pt", paddingTop: 30 }}>
                                <Header.Content style={{ fontSize: "18pt", color: 'black' }}>
                                    COVID-19 by County Characteristics
              <Header.Subheader style={{ color: '#000000', textAlign: 'left', fontSize: "16pt", paddingTop: 16, paddingBottom: 28, paddingLeft: 0, paddingRight: 0 }}>
                                        {/* <center> <b style={{ fontSize: "18pt" }}>COVID-19 cases per 100,000 across the population characteristics of all the counties in the United States </b> </center> */}

                                        COVID-19 affects communities very differently. Underlying medical conditions;
                                        racial, gender, and age demographics; income levels; and population density are
                                        all contributing factors that determine the rate of COVID-19 in different counties.
                                        Some of the many county characteristics that may have a large impact on disparate rates
                                        of infection are displayed below, with counties divided into quintiles based on each characteristic,
                                        unless otherwise noted.
              </Header.Subheader>
                                </Header.Content>
                            </Header>
                            {/* urbanrural */}
                            <Grid id='urbanrural' style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: 11 }}>
                                    <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                COVID-19 Case Rate by Urban-Rural Classification
            		                        </Header.Content>
                                        </Header>
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 250, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "13pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Cases per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} /><VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Inner city", 'value': data_index['urbanrural']["LargeCentralMetro"]['casesdailymean7R'] || 0 },
                                                    { key: "Large suburbs", 'value': data_index['urbanrural']["LargeFringeMetro"]['casesdailymean7R'] || 0 },
                                                    { key: "Small suburbs", 'value': data_index['urbanrural']["MediumMetro"]['casesdailymean7R'] || 0 },
                                                    { key: "Small cities", 'value': data_index['urbanrural']["SmallMetro"]['casesdailymean7R'] || 0 },
                                                    { key: "Smallest cities", 'value': data_index['urbanrural']["Micropolitan(Nonmetro)"]['casesdailymean7R'] || 0 },
                                                    { key: "Rural counties", 'value': data_index['urbanrural']["NonCore(Nonmetro)"]['casesdailymean7R'] || 0 }
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: casesColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>

                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>

                                                <br />
                                                <b>Average Daily COVID-19 Cases per 100,000</b>
                                            </center>
                                        </Header.Content>
                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 Death Rate by Urban-Rural Classification
                </Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 250, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "13pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Deaths per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(3))}
                                                data={[
                                                    { key: "Inner city", 'value': data_index['urbanrural']["LargeCentralMetro"]['deathsdailymean7R'] || 0 },
                                                    { key: "Large suburbs", 'value': data_index['urbanrural']["LargeFringeMetro"]['deathsdailymean7R'] || 0 },
                                                    { key: "Small suburbs", 'value': data_index['urbanrural']["MediumMetro"]['deathsdailymean7R'] || 0 },
                                                    { key: "Small cities", 'value': data_index['urbanrural']["SmallMetro"]['deathsdailymean7R'] || 0 },
                                                    { key: "Rural areas near cities", 'value': data_index['urbanrural']["Micropolitan(Nonmetro)"]['deathsdailymean7R'] || 0 },
                                                    { key: "Remote rural areas", 'value': data_index['urbanrural']["NonCore(Nonmetro)"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "18px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: mortalityColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>


                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>

                                                <br />
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid>
                                <Grid.Row columns={2} style={{ paddingBottom: 7 }}>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 132 }}>
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This chart shows the number of COVID-19 cases per 100,000 residents (x-axis) by metropolitan status (y-axis).
                                                Inner city counties have {'>'} 1 million population or contain the entire or large part of the population of the largest principle city.
                                                Large suburban counties have a population {'>'} 1 million, but do not qualify as inner city. Small suburban counties have a population of 250,000-999,999.
                                                Small cities have populations {'<'} 250,000 and are near large cities. Smallest city counties have an urbanized area with population between 10,000-49,999.
                                                Remote rural counties have populations less than 10,000 individuals. This urban-rural classification comes from the National Center for Health Statistics. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>

                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 33 }}>
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This chart shows the number of COVID-19 deaths per 100,000 residents (x-axis) by metropolitan status (y-axis).
                                                Inner city counties have {'>'} 1 million population or contain the entire or large part of the population of the largest principle city.
                                                Large suburban counties have a population {'>'} 1 million, but do not qualify as inner city. Small suburban counties have a population of 250,000-999,999.
                                                Small cities have populations {'<'} 250,000 and are near large cities. Smallest city counties have an urbanized area with population between 10,000-49,999.
                                                Remote rural counties have populations less than 10,000 individuals. This urban-rural classification comes from the National Center for Health Statistics. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <center> <Divider id="poverty" hidden style={{ paddingBottom: 50 }} /> </center>
                            {/* poverty */}
                            <Grid style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: '2em' }}>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                COVID-19 Case Rate by Percentage of <br />Population in Poverty
</Header.Content>
                                        </Header>
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 310, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD

                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Cases per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Counties with lowest percentage\n population in poverty", 'value': data_index['poverty']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['poverty']["Q2"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['poverty']["Q3"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['poverty']["Q4"]['casesdailymean7R'] || 0 },
                                                    { key: "Counties with highest percentage\n  population in poverty", 'value': data_index['poverty']["high20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>

                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>
                                                <br />
                                                <b>Average Daily COVID-19 Cases per 100,000</b>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 Death Rate by Percentage of <br />Population in Poverty
</Header.Content>
                                        </Header>
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 310, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "transparent" }, grid: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Deaths per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                data={[
                                                    { key: "Counties with lowest percentage\n population in poverty", 'value': data_index['poverty']["low20"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['poverty']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['poverty']["Q3"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['poverty']["Q4"]['deathsdailymean7R'] || 0 },
                                                    { key: "Counties with highest percentage\n population in poverty", 'value': data_index['poverty']["high20"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: mortalityColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>

                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>
                                                <br />
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid>
                                <Grid.Row columns={2} style={{ paddingBottom: 7 }}>
                                    <Grid.Column>
<<<<<<< HEAD
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 132 }}>
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                {/* <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This figure shows total cases of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are male. US counties were grouped into 5 categories based on the proportion of male residents.
                      We can see that in counties with the highest proportion of male residents (highest 20%), the rate is <b>{(data_index['male']["high20"]['casesdailymean7R']).toFixed(0)}</b> cases per 100,000.
                      In counties with the lowest proportion of male residents (lowest 20%), the rate is <b>{(data_index['male']["low20"]['casesdailymean7R']).toFixed(0)}</b> COVID-19 cases per 100,000.
					          </Header.Subheader> */}
=======
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 132 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This chart shows the number of COVID-19 cases per 100,000 residents by county ranking on percentage of population in poverty.
                                                    The y-axis displays percentage population in poverty rankings for counties based on quintiles (groups of 20%). The x-axis displays
                                                the average number of COVID-19 cases per 100,000 that occurred in each group of counties ranked by percentage population in poverty. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
<<<<<<< HEAD
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 33 }}>
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                {/* <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This figure shows total cases of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are over the age of 65. US counties were grouped into 5 categories based on the proportion of
                      over the age of 65 residents. We can see that in counties with the highest proportion of residents over the age of 65 years (highest 20%),
                      the rate is <b>{(data_index['age65over']["high20"]['casesdailymean7R']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of residents over the age of 65 years (lowest 20%),
                      the rate is <b>{(data_index['age65over']["low20"]['casesdailymean7R']).toFixed(0)}</b> COVID-19 cases per 100,000.
					          </Header.Subheader> */}
=======
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 33 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This chart shows the number of COVID-19 deaths per 100,000 residents by county ranking on percentage of population in poverty.
                                                    The y-axis displays percentage population in poverty rankings for counties based on quintiles (groups of 20%). The x-axis displays
                                                the average number of COVID-19 deaths per 100,000 that occurred in each group of counties ranked by percentage population in poverty. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <center> <Divider id="black" hidden style={{ paddingBottom: 50 }} /> </center>
                            {/* black */}
                            <Grid id='black' style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: '2em' }}>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                COVID-19 Case Rate by Percentage of <br />African American Population
            		</Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 310, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Cases per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Counties with lowest percentage\n African American", 'value': data_index['black']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['black']["Q2"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['black']["Q3"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['black']["Q4"]['casesdailymean7R'] || 0 },
                                                    { key: "Counties with highest percentage\n African American", 'value': data_index['black']["high20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>

                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>
                                                <br />
                                                <b>Average Daily COVID-19 Cases per 100,000</b>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 Death Rate by Percentage of <br />African American Population
                </Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 310, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Deaths per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                data={[
                                                    { key: " Counties with lowest\n percentage African American", 'value': data_index['black']["low20"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['black']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['black']["Q3"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['black']["Q4"]['deathsdailymean7R'] || 0 },
                                                    { key: "Counties with highest\n percentage African American", 'value': data_index['black']["high20"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: mortalityColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>


                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>
                                                <br />
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid>
                                <Grid.Row columns={2} style={{ paddingBottom: 7 }}>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 132 }}>
                                            <Header.Content>
<<<<<<< HEAD
                                                {/* <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total cases of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are African American. US counties were grouped into 5 categories based on the proportion of
                      African American residents. We can see that in counties with the highest proportion of African American residents (highest 20%),
                      the rate is <b>{(data_index['black']["high20"]['casesdailymean7R']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of African American residents (lowest 20%),
                      the rate is <b>{(data_index['black']["low20"]['casesdailymean7R']).toFixed(0)}</b> COVID-19 cases per 100,000.
					          </Header.Subheader> */}
=======
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This chart shows the number of COVID-19 cases per 100,000 residents by percentage African American population ranking.
                                                    The y-axis displays percentage African American population rankings based on quintiles (groups of 20%). The x-axis displays
                                                the average number of COVID-19 cases per 100,000 that occurred in each group of counties ranked by percentage African American. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 33 }}>
                                            <Header.Content>
<<<<<<< HEAD
                                                {/* <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total cases of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are below the federal poverty line. US counties were grouped into 5 categories based on the proportion of
                      residents in poverty. We can see that in counties with the highest proportion of residents in poverty (highest 20%),
                      the rate is <b>{(data_index['poverty']["high20"]['casesdailymean7R']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of residents in poverty (lowest 20%),
                       the rate is <b>{(data_index['poverty']["low20"]['casesdailymean7R']).toFixed(0)}</b> COVID-19 cases per 100,000.
					          </Header.Subheader> */}
=======
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This chart shows the number of COVID-19 deaths per 100,000 residents by percentage African American population ranking.
                                                    The y-axis displays percentage African American population rankings based on quintiles (groups of 20%). The x-axis displays
                                                the average number of COVID-19 deaths per 100,000 that occurred in each group of counties ranked by percentage African American. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <center> <Divider id="hispanic" hidden style={{ paddingBottom: 50 }} /> </center>
                            {/* Hispanic */}
                            <Grid id='hispanic' style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: '2em' }}>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 Case Rate by Percentage of <br /> Hispanic Population
            		</Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 250, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Cases per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Counties with lowest\n percentage Hispanic", 'value': data_index['hispanic']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['hispanic']["Q2"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['hispanic']["Q3"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['hispanic']["Q4"]['casesdailymean7R'] || 0 },
                                                    { key: "Counties with highest\n percentage Hispanic", 'value': data_index['hispanic']["high20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>

                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>
                                                <br />
                                                <b>Average Daily COVID-19 Cases per 100,000</b>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 Death Rate by Percentage of <br /> Hispanic Population
                </Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 250, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Deaths per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(3))}
                                                data={[
                                                    { key: "Counties with lowest\n percentage Hispanic", 'value': data_index['hispanic']["low20"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['hispanic']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['hispanic']["Q3"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['hispanic']["Q4"]['deathsdailymean7R'] || 0 },
                                                    { key: "Counties with highest\n percentage Hispanic", 'value': data_index['hispanic']["high20"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "18px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: mortalityColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>

                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>
                                                <br />
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid>
                                <Grid.Row columns={2} style={{ paddingBottom: 7 }}>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 132 }}>
                                            <Header.Content>
<<<<<<< HEAD
                                                {/* <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total cases of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who have diabetes. US counties were grouped into 5 categories based on the proportion of
                      residents with diabetes. We can see that in counties with the highest proportion of residents with diabetes (highest 20%),
                      the rate is <b>{(data_index['diabetes']["high20"]['casesdailymean7R']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of residents with diabetes (lowest 20%),
                      the rate is <b>{(data_index['diabetes']["low20"]['casesdailymean7R']).toFixed(0)}</b> COVID-19 cases per 100,000
					          </Header.Subheader> */}
=======
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This chart shows the number of COVID-19 cases per 100,000 residents by percentage Hispanic population ranking. The y-axis displays percentage
                                                    Hispanic population rankings based on quintiles (groups of 20%). The x-axis displays the average number of COVID-19 cases per 100,000 that occurred
                                                in each group of counties ranked by percentage Hispanic. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 33 }}>
                                            <Header.Content>
<<<<<<< HEAD
                                                {/* <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total cases of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are Hispanic. US counties were grouped into 5 categories based on the proportion of
                      Hispanic residents. We can see that in counties with the highest proportion of Hispanic residents (highest 20%),
                      the rate is <b>{(data_index['hispanic']["high20"]['casesdailymean7R']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of Hispanic residents (lowest 20%),
                      the rate is <b>{(data_index['hispanic']["low20"]['casesdailymean7R']).toFixed(0)}</b> COVID-19 cases per 100,000.
					          </Header.Subheader> */}
=======
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This chart shows the number of COVID-19 deaths per 100,000 residents by percentage Hispanic population ranking. The y-axis
                                                    displays percentage Hispanic population rankings based on quintiles (groups of 20%). The x-axis displays the average number
                                                of COVID-19 deaths per 100,000 that occurred in each group of counties ranked by percentage Hispanic. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <center> <Divider id="diabetes" hidden style={{ paddingBottom: 50 }} /> </center>

                            {/* diabetes */}
                            <Grid id='diabetes' style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: '2em' }}>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 Case Rate by Percentage of <br />Population with Diabetes
</Header.Content>
                                        </Header>
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 310, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD

                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Cases per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Counties with lowest percentage\n population with diabetes", 'value': data_index['diabetes']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['diabetes']["Q2"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['diabetes']["Q3"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['diabetes']["Q4"]['casesdailymean7R'] || 0 },
                                                    { key: "Counties with highest percentage\n population with diabetes", 'value': data_index['diabetes']["high20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>

                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>
                                                <br />
                                                <b>Average Daily COVID-19 Cases per 100,000</b>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 Death Rate by Percentage of <br />Population with Diabetes
</Header.Content>
                                        </Header>
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 310, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "transparent" }, grid: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Deaths per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                data={[
                                                    { key: "Counties with lowest percentage\n population with diabetes", 'value': data_index['diabetes']["low20"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['diabetes']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['diabetes']["Q3"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['diabetes']["Q4"]['deathsdailymean7R'] || 0 },
                                                    { key: "Counties with highest percentage\n population with diabetes", 'value': data_index['diabetes']["high20"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: mortalityColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>

                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>
                                                <br />
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid>
                                <Grid.Row columns={2} style={{ paddingBottom: 7 }}>
                                    <Grid.Column>
<<<<<<< HEAD
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 132 }}>
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                {/* <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This figure shows total deaths of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are male. US counties were grouped into 5 categories based on the proportion of male residents.
                      We can see that in counties with the highest proportion of male residents (highest 20%), the rate is <b>{(data_index['male']["high20"]['deathsdailymean7R']).toFixed(1)}</b> deaths per 100,000.
                      In counties with the lowest proportion of male residents (lowest 20%), the rate is <b>{(data_index['male']["low20"]['deathsdailymean7R']).toFixed(1)}</b> COVID-19 deaths per 100,000.
                    </Header.Subheader> */}
=======
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 132 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This chart shows the number of COVID-19 cases per 100,000 residents by county ranking on percentage of population with diabetes.
                                                    The y-axis displays percentage population with diabetes rankings for counties based on quintiles (groups of 20%). The x-axis displays
                                                the average number of COVID-19 cases per 100,000 that occurred in each group of counties ranked by percentage population with diabetes. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
<<<<<<< HEAD
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 33 }}>
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                {/* <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This figure shows total deaths of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are over the age of 65. US counties were grouped into 5 categories based on the proportion of
                      over the age of 65 residents. We can see that in counties with the highest proportion of residents over the age of 65 years (highest 20%),
                      the rate is <b>{(data_index['age65over']["high20"]['deathsdailymean7R']).toFixed(2)}</b> deaths per 100,000. In counties with the lowest proportion of residents over the age of 65 years (lowest 20%),
                      the rate is <b>{(data_index['age65over']["low20"]['deathsdailymean7R']).toFixed(2)}</b> COVID-19 deaths per 100,000.
                    </Header.Subheader> */}
=======
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 33 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This chart shows the number of COVID-19 deaths per 100,000 residents by county ranking on percentage of population with diabetes.
                                                    The y-axis displays percentage population with diabetes rankings for counties based on quintiles (groups of 20%). The x-axis displays
                                                the average number of COVID-19 deaths per 100,000 that occurred in each group of counties ranked by percentage population with diabetes. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <center> <Divider id="age" hidden style={{ paddingBottom: 50 }} /> </center>
                            {/* age */}
                            <Grid id='age' style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: 11 }}>
                                    <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                COVID-19 Case Rate by Percentage of <br />Population over the Age 65 Years
            		</Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 250, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Cases per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Counties with lowest\n percentage over 65", 'value': data_index['age65over']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['age65over']["Q2"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['age65over']["Q3"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['age65over']["Q4"]['casesdailymean7R'] || 0 },
                                                    { key: "Counties with highest\n percentage over 65", 'value': data_index['age65over']["high20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: casesColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>

                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>
                                                <br />
                                                <b>Average Daily COVID-19 Cases per 100,000</b>
                                            </center>
                                        </Header.Content>
                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 Death Rate by Percentage of <br />Population over the Age 65 Years
                </Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 250, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Deaths per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                data={[
                                                    { key: "Counties with lowest\n percentage over 65", 'value': data_index['age65over']["low20"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['age65over']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['age65over']["Q3"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['age65over']["Q4"]['deathsdailymean7R'] || 0 },
                                                    { key: "Counties with highest\n percentage over 65", 'value': data_index['age65over']["high20"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: mortalityColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>

                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>
                                                <br />
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid>
                                <Grid.Row columns={2} style={{ paddingBottom: 7 }}>
                                    <Grid.Column>
<<<<<<< HEAD
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 132 }}>
                                            <Header.Content>
                                                {/* <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total deaths of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are African American. US counties were grouped into 5 categories based on the proportion of
                      African American residents. We can see that in counties with the highest proportion of African American residents (highest 20%),
                      the rate is <b>{(data_index['black']["high20"]['deathsdailymean7R']).toFixed(2)}</b> deaths per 100,000. In counties with the lowest proportion of African American residents (lowest 20%),
                      the rate is <b>{(data_index['black']["low20"]['deathsdailymean7R']).toFixed(2)}</b> COVID-19 deaths per 100,000.
                    </Header.Subheader> */}
=======
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 132 }}>
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This chart shows the number of COVID-19 cases per 100,000 residents by county ranking on percentage of population over 65 years.
                                                    The y-axis displays percentage population over 65 rankings for counties based on quintiles (groups of 20%). The x-axis displays the
                                                average number of COVID-19 cases per 100,000 that occurred in each group of counties ranked by percentage population over 65 years. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 33 }}>
<<<<<<< HEAD
                                            <Header.Content>
                                                {/* <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total deaths of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are below the federal poverty line. US counties were grouped into 5 categories based on the proportion of
                      residents in poverty. We can see that in counties with the highest proportion of residents in poverty (highest 20%),
                      the rate is <b>{(data_index['poverty']["high20"]['deathsdailymean7R']).toFixed(2)}</b> deaths per 100,000. In counties with the lowest proportion of residents in poverty (lowest 20%),
                       the rate is <b>{(data_index['poverty']["low20"]['deathsdailymean7R']).toFixed(2)}</b> COVID-19 deaths per 100,000.
                    </Header.Subheader> */}
=======
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This chart shows the number of COVID-19 deaths per 100,000 residents by county ranking on percentage of population over 65 years.
                                                    The y-axis displays percentage population over 65 rankings for counties based on quintiles (groups of 20%). The x-axis displays the
                                                average number of COVID-19 deaths per 100,000 that occurred in each group of counties ranked by percentage population over 65 years. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                            <center> <Divider id='male' hidden style={{ paddingBottom: 50 }} /> </center>
                            {/* Male */}
                            <Grid style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: 11 }}>
                                    <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                COVID-19 Case Rate by Percentage of <br /> Male Population
            		                        </Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 310, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Cases per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Counties with lowest\n percentage male population", 'value': data_index['male']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['male']["Q2"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['male']["Q3"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['male']["Q4"]['casesdailymean7R'] || 0 },
                                                    { key: "Counties with highest\n percentage male population", 'value': data_index['male']["high20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>

                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>
                                                <br />
                                                <b>Average Daily COVID-19 Cases per 100,000</b>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                COVID-19 Death Rate by Percentage of <br /> Male Population
                </Header.Content>
                                        </Header>
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 310, right: 30, top: 30, bottom: 35 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
<<<<<<< HEAD
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            {/* <VictoryBar
=======
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis
                                                label={"COVID-19 Deaths per\n 100,000 Residents"}
                                                style={{
                                                    ticks: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { stroke: "#000000" }, axisLabel: { fontSize: "14px", fill: '#000000', fontFamily: 'lato' },
                                                    labels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' }, tickLabels: { fontSize: "0px", fill: '#000000', padding: 10, fontFamily: 'lato' }
                                                }} />
                                            <VictoryBar
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                data={[
                                                    { key: "Counties with lowest\n percentage male population", 'value': data_index['male']["low20"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['male']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['male']["Q3"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['male']["Q4"]['deathsdailymean7R'] || 0 },
                                                    { key: "Counties with highest\n percentage male population ", 'value': data_index['male']["high20"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: mortalityColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            /> */}
                                        </VictoryChart>
                                        <Header.Content style={{ fontWeight: 300, paddingBottom: 10, fontSize: "14pt", lineHeight: "18pt" }}>
                                            <center>
                                                <br />
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </center>
                                        </Header.Content>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid>
                                <Grid.Row columns={2} style={{ paddingBottom: 7 }}>
                                    <Grid.Column>
<<<<<<< HEAD
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 132 }}>
                                            <Header.Content>
                                                {/* <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total deaths of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who have diabetes. US counties were grouped into 5 categories based on the proportion of
                      residents with diabetes. We can see that in counties with the highest proportion of residents with diabetes (highest 20%),
                      the rate is <b>{(data_index['diabetes']["high20"]['deathsdailymean7R']).toFixed(2)}</b> deaths per 100,000. In counties with the lowest proportion of residents with diabetes (lowest 20%),
                      the rate is <b>{(data_index['diabetes']["low20"]['deathsdailymean7R']).toFixed(2)}</b> COVID-19 deaths per 100,000
                    </Header.Subheader> */}
=======
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 132 }}>
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This chart shows the number of COVID-19 cases per 100,000 residents by percentage male population ranking. The y-axis displays
                                                    percentage male rankings for counties based on quintiles (groups of 20%). The x-axis displays the average number of COVID-19 cases
                                                per 100,000 that occurred in each group of counties ranked by percentage male. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 33 }}>
<<<<<<< HEAD
                                            <Header.Content>
                                                {/* <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total deaths of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are Hispanic. US counties were grouped into 5 categories based on the proportion of
                      Hispanic residents. We can see that in counties with the highest proportion of Hispanic residents (highest 20%),
                      the rate is <b>{(data_index['hispanic']["high20"]['deathsdailymean7R']).toFixed(2)}</b> deaths per 100,000. In counties with the lowest proportion of Hispanic residents (lowest 20%),
                      the rate is <b>{(data_index['hispanic']["low20"]['deathsdailymean7R']).toFixed(2)}</b> COVID-19 deaths per 100,000.
                    </Header.Subheader> */}
=======
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This chart shows the number of COVID-19 deaths per 100,000 residents by percentage male population ranking. The y-axis displays
                                                    percentage male rankings for counties based on quintiles (groups of 20%). The x-axis displays the average number of COVID-19 deaths
                                                per 100,000 that occurred in each group of counties ranked by percentage male. <b>Data Updated: {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' :
                                                        (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}</b>
                                                </Header.Subheader>
>>>>>>> c05a4b75d504b1085201d826b6384fa4fcdd8338
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </div>
                    }
                    <Notes />
                </Container>
                <ReactTooltip id='cvi'>{tooltipContentcvi}</ReactTooltip>
                <ReactTooltip id='si'>{tooltipContentsi}</ReactTooltip>
                <ReactTooltip id='ga'> <font size="+2"><b >{countyName}</b> </font> <br />
                    <b>Total Cases</b>: {data[stateFips + countyFips]['casescum'] >= 0 ? data[stateFips + countyFips]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFips]['deathscum'] >= 0 ? data[stateFips + countyFips]['deathscum'].toFixed(0) : "N/A"} <br />
                    <b>Total case per 100k</b>: {data[stateFips + countyFips]['casescumR'] >= 0 ? data[stateFips + countyFips]['casescumR'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths per 100k</b>: {data[stateFips + countyFips]['deathscumR'] >= 0 ? data[stateFips + countyFips]['deathscumR'].toFixed(0) : 'N/A'} <br />
                    <b>Last 14-day Cases per 100k</b>: {data[stateFips + countyFips]['casescum14dayR'] >= 0 ? data[stateFips + countyFips]['casescum14dayR'].toFixed(0) : "N/A"} <br />
                    <b>Click to see county-level data.</b> </ReactTooltip>
            </div>
        );
    }
    else {
        return <Loader active inline='centered' />
    }
}