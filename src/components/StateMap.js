import React, { useEffect, useState } from 'react'
import { Container, Grid, Breadcrumb, Dropdown, Header, Loader, Divider } from 'semantic-ui-react'
import AppBar from './AppBar';
import Geographies from './Geographies';
import Geography from './Geography';
import ComposableMap from './ComposableMap';
import {
    VictoryChart,
    VictoryTooltip,
    VictoryContainer,
    VictoryVoronoiContainer,
    VictoryBar,
    VictoryTheme,
    VictoryAxis,
    VictoryLine,
    VictoryLabel
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

const colorOut = '#7d0707';

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
                    tickFormat={(y) => (y < 1000 ? (Math.round(y,2)===0.00? " ": y) : (y / 1000 + 'k'))}
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
                        tickFormat={(y) => (y < 1000 ? (Math.round(y,2)===0.00? " ": y) : (y / 1000 + 'k'))}
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
                    tickFormat={(y) => (y < 1000 ? (Math.round(y,2)===0.00? " ": y) : (y / 1000 + 'k'))}
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
                        tickFormat={(y) => (y < 1000 ? (Math.round(y,2)===0.00? " ": y) : (y / 1000 + 'k'))}
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
    const [countyName, setCountyName] = useState('Fulton County');
    const history = useHistory();
    const [fips, setFips] = useState('13');

    // const [dataFltrd, setDataFltrd] = useState();
    // const [dataFltrdUs, setDataFltrdUs] = useState();

    // const [dataStateFltrd, setDataStateFltrd] = useState();
    // const [dataState, setDataState] = useState();

    const [data, setData] = useState();
    const [dataUs, setDataUs] = useState();
    const [data_index, setIndexData] = useState();

    const [dateCur, setDateCur] = useState();
    const [topTen, setTopTen] = useState([]);
    // const [stateLabels, setStateLabels] = useState();
    const [covidMetric, setCovidMetric] = useState({ casesdaily: 'N/A', casesdailymean14: 'N/A', t: 'n/a' });
    const [covidMetric14, setCovidMetric14] = useState({ casesdaily: 'N/A', casesdailymean14: 'N/A', t: 'n/a' });

    const [dataTS, setDataTS] = useState();
    const [tooltipContent, setTooltipContent] = useState('');
    const [colorScale, setColorScale] = useState();

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



    useEffect(() => {

        const configMatched = configs.find(s => s.fips === stateFips);
        // console.log(configMatched.fips);
        if (!configMatched) {
            history.push('/');
        } else {

            setConfig(configMatched);
            // console.log(countyFips);
            setStateName(configMatched.name);

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
                    // console.log(x)
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
            // console.log(data[stateFips+countyFips])
            // setDateCur(data[stateFips+countyFips])
        }
    }, [dataTS, countyFips])

    if (dataTS && dataUs) {

        return (
            <div>
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
                            <Divider hidden />
                            <Grid columns={16}>
                                <Grid.Column width={7} style={{ paddingLeft: "2", paddingLeft: "1" }}>
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
                                            {/* <Header.Subheader style={{ fontWeight: 300 }}>
                        Health determinants impact COVID-19 outcomes.
                    </Header.Subheader> */}
                                            {/* <Header.Subheader style={{ fontWeight: 300 }}>Click on a state below to drill down to your county data.</Header.Subheader> */}
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
                                    {/* <div style={{ paddingTop: 0, paddingLeft: '1em', paddingRight: '4em' }}> */}
                                    {/* <Slider
                                        defaultValue={20}
                                        // getAriaValueText={valuetext}
                                        aria-labelledby="discrete-slider"
                                        valueLabelDisplay="off"
                                        step={10}
                                        marks={marks}
                                        min={0}
                                        max={40}
                                    />
                                    </div> */}



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
                                                        <rect x={50} y={40} width="15" height="15" style={{ fill: stateColor, strokeWidth: 1, stroke: stateColor }} /> :
                                                        <rect x={50} y={35} width="15" height="1" style={{ fill: '#71c7ec', strokeWidth: 1, stroke: '#71c7ec' }} />}
                                                    {varGraphPair[metric]['name'][1] === 'casesdailymean7' || varGraphPair[metric]['name'][1] === 'deathsdailymean7' ?
                                                        <text x={75} y={52} style={{ fontSize: 16 }}> {varGraphPair[metric]['legend'][0]} </text> :
                                                        <rect x={50} y={35} width="15" height="1" style={{ fill: '#71c7ec', strokeWidth: 1, stroke: '#71c7ec' }} />}
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
                                                    This chart shows the daily number of new confirmed COVID-19 {varNameMap[metric].name} in <b>{countyName}</b> as of {dataTS[stateFips + countyFips][0].todaydate === 'n/a' ? 'N/A' : (new Date(dataTS[stateFips + countyFips][0].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}. The daily number reflects the date the {varNameMap[metric].cat} was first reported to DPH.
                        The vertical bars show the number of new daily {varNameMap[metric].name} while the line shows the 7-day moving average of new daily {varNameMap[metric].name}.
                        </small>
                                            </Grid.Row>
                                        </Grid.Column>
                                    </Grid>
                                </Grid.Column>

                            </Grid>
                            <center> <Divider /> </center>
                            {/* <Header as='h2' style={{ textAlign: 'center', color: '#487f84', fontSize: "22pt", paddingTop: 30 }}> */}
                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "18pt", paddingTop: 30 }}>

                                <Header.Content>
                                    COVID-19 by Community Vulnerability Index
                                <Header.Subheader style={{ color: '#000000', textAlign: 'left', fontSize: "16pt", paddingTop: 16, paddingBottom: 28, paddingLeft: 0, paddingRight: 0 }}>

                                        Some communities are limited in their ability to prevent, manage, and mitigate the spread of a pandemic disease,
                                        and its economic and social impacts, rendering them more vulnerable to COVID-19 than others. CVI incorporates
                                        the SVI’s sociodemographic variables, along with risk factors specific to COVID-19 and variables measuring the
                                        capacity of public health systems. It considers six core themes that together account for 34 factors that make
                                        a community vulnerable to the COVID-19 pandemic.

                <br />
                                        <br />

                                    </Header.Subheader>
                                </Header.Content>
                            </Header>

                            <Grid>
                                <Grid.Row columns={1} style={{ paddingTop: 8 }}>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                Cases per 100,000 residents by Community Vulnerability Index
                </Header.Content>
                                        </Header>
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
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.75}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': (data_index['cvi_index']["low20"]['casesdailymean7R'] / data_index['cvi_index']["low20"]['casesdailymean7R']) * data_index['cvi_index']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': (data_index['cvi_index']["Q2"]['casesdailymean7R'] / data_index['cvi_index']["low20"]['casesdailymean7R']) * data_index['cvi_index']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': (data_index['cvi_index']["Q3"]['casesdailymean7R'] / data_index['cvi_index']["low20"]['casesdailymean7R']) * data_index['cvi_index']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': (data_index['cvi_index']["Q4"]['casesdailymean7R'] / data_index['cvi_index']["low20"]['casesdailymean7R']) * data_index['cvi_index']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': (data_index['cvi_index']["high20"]['casesdailymean7R'] / data_index['cvi_index']["low20"]['casesdailymean7R']) * data_index['cvi_index']["low20"]['casesdailymean7R'] || 0 }



                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: casesColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <center>
                                                <text style={{ fontWeight: 300, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                    <br />
                                                    <b>Average Daily COVID-19 Cases per 100,000</b>
                                                </text>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>

                                    <Grid.Column>
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", paddingLeft: 0, paddingLeft: 0, paddingTop: 30, paddingBottom: 50 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", fontSize: "14pt", textAlign: 'justify', paddingRight: 0 }}>
                                                    US counties were grouped into 5 categories based on their CVI score.  As of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}, we can see that counties in US with higher vulnerability index have higher COVID-19 cases per 100,000 residents as compared to counties in US with lower vulnerability index.
                                            </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>

                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                Deaths per 100,000 residents by Community Vulnerability Index
                </Header.Content>
                                        </Header>
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
                                            <VictoryBar
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
                                                style={{
                                                    data: {
                                                        fill: mortalityColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <center>
                                                <text style={{ fontWeight: 300, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                    <br />
                                                    <b>Average Daily COVID-19 Deaths per 100,000</b>
                                                </text>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", paddingLeft: 0, paddingLeft: 0, paddingTop: 30, paddingBottom: 50 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", fontSize: "14pt", textAlign: 'justify', paddingRight: 0 }}>
                                                    US counties were grouped into 5 categories based on their CVI score.  As of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}, we can see that counties in US with higher vulnerability index have higher COVID-19 deaths per 100,000 residents as compared to counties in US with lower vulnerability index.
                                            </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>


                            <center> <Divider /> </center>
                            {/* <Header as='h2' style={{ textAlign: 'center', color: '#487f84', fontSize: "22pt", paddingTop: 30 }}> */}
                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "18pt", paddingTop: 30 }}>

                                <Header.Content>
                                    COVID-19 by Residential Segregation Index
                                <Header.Subheader style={{ color: '#000000', textAlign: 'left', fontSize: "16pt", paddingTop: 16, paddingBottom: 28, paddingLeft: 0, paddingRight: 0 }}>

                                        Residential segregation is a key factor responsible for the disproportionate impact of COVID-19 on different communities in the US.
                                        It allows for social conditions that facilitate transmission and vulnerability to the effects of pandemic to be concentrated in
                                        geographically defined areas. This results in the entire neighborhood being more exposed to the virus than others and more
                                        vulnerable to its effects and limited quality of care. In the figures below, we show the severity of COVID-19 across
                                        counties with different levels of residential segregation index.
                <br />
                                        <br />

                                    </Header.Subheader>
                                </Header.Content>
                            </Header>

                            <Grid>
                                <Grid.Row columns={1} style={{ paddingTop: 8 }}>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                Cases per 100,000 residents by Residential segregation
                </Header.Content>
                                        </Header>
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
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.75}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': (data_index['s_index']["low20"]['casesdailymean7R'] / data_index['s_index']["low20"]['casesdailymean7R']) * data_index['s_index']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': (data_index['s_index']["Q2"]['casesdailymean7R'] / data_index['s_index']["low20"]['casesdailymean7R']) * data_index['s_index']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': (data_index['s_index']["Q3"]['casesdailymean7R'] / data_index['s_index']["low20"]['casesdailymean7R']) * data_index['s_index']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': (data_index['s_index']["Q4"]['casesdailymean7R'] / data_index['s_index']["low20"]['casesdailymean7R']) * data_index['s_index']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': (data_index['s_index']["high20"]['casesdailymean7R'] / data_index['s_index']["low20"]['casesdailymean7R']) * data_index['s_index']["low20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: casesColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <center>
                                                <text style={{ fontWeight: 300, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                    <br />
                                                    <b>Average Daily COVID-19 Cases per 100,000</b>
                                                </text>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>

                                    <Grid.Column>
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", paddingLeft: 0, paddingLeft: 0, paddingTop: 30, paddingBottom: 50 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", fontSize: "14pt", textAlign: 'justify', paddingRight: 0 }}>
                                                    US counties were grouped into 5 categories based on their residential segregation index.  As of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}, we can see that counties in US with lower residential segregation index have higher COVID-19 cases per 100,000 residents as compared to counties in US with higher residential segregation index.
                                            </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>

                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                Deaths per 100,000 residents by Residential segregation
                </Header.Content>
                                        </Header>
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
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.75}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': (data_index['s_index']["low20"]['deathsdailymean7R'] / data_index['s_index']["Q2"]['deathsdailymean7R']) * data_index['s_index']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': (data_index['s_index']["Q2"]['deathsdailymean7R'] / data_index['s_index']["Q2"]['deathsdailymean7R']) * data_index['s_index']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': (data_index['s_index']["Q3"]['deathsdailymean7R'] / data_index['s_index']["Q2"]['deathsdailymean7R']) * data_index['s_index']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': (data_index['s_index']["Q4"]['deathsdailymean7R'] / data_index['s_index']["Q2"]['deathsdailymean7R']) * data_index['s_index']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': (data_index['s_index']["high20"]['deathsdailymean7R'] / data_index['s_index']["Q2"]['deathsdailymean7R']) * data_index['s_index']["Q2"]['deathsdailymean7R'] || 0 }



                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: mortalityColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <center>
                                                <text style={{ fontWeight: 300, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                    <br />
                                                    <b>Average Daily COVID-19 Deaths per 100,000</b>
                                                </text>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", paddingLeft: 0, paddingLeft: 0, paddingTop: 30, paddingBottom: 50 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", fontSize: "14pt", textAlign: 'justify', paddingRight: 0 }}>
                                                    US counties were grouped into 5 categories based on their residential segregation index.  As of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}, we can see that counties in US with lower residential segregation index have higher deaths associated with COVID-19 per 100,000 residents as compared to counties in US with higher residential segregation index.
                                            </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>

                            <center> <Divider /> </center>

                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "18pt", paddingTop: 30 }}>
                                <Header.Content style={{ fontSize: "22pt", color: '#487f84' }}>
                                    COVID-19 by County Characteristics
              <Header.Subheader style={{ color: '#000000', textAlign: 'left', fontSize: "16pt", paddingTop: 16, paddingBottom: 28, paddingLeft: 0, paddingRight: 0 }}>
                                        <center> <b style={{ fontSize: "18pt" }}>COVID-19 cases per 100,000 across the population characteristics of all the counties in the United States </b> </center>
                                        <br />
                                        <br />
                                        COVID-19 is affecting communities very differently. Underlying medical conditions; racial,
                                        gender, and age demographics; income levels; and population density are all contributing factors
                                        that determine the rate of COVID-19 in different counties. Some of the many county characteristics
                                        that may have a large impact on disparate rates of infection are displayed below, with counties divided
                                        into quintiles based on each characteristic unless otherwise noted.

              </Header.Subheader>
                                </Header.Content>
                            </Header>

                            <Grid style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: 11 }}>
                                    <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                COVID-19 cases by percentage of <br /> male population
            		                        </Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 160, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >

                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': data_index['male']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['male']["Q2"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['male']["Q3"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['male']["Q4"]['casesdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': data_index['male']["high20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <center>
                                                <text style={{ fontWeight: 300, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                    <br />
                                                    <b>Average Daily COVID-19 Cases per 100,000</b>
                                                </text>
                                            </center>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                COVID-19 cases by percentage of <br />population over the age 65 years
            		</Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 160, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "transparent" }, grid: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': data_index['age65over']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['age65over']["Q2"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['age65over']["Q3"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['age65over']["Q4"]['casesdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': data_index['age65over']["high20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: casesColor[1]
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <center>
                                                <text style={{ fontWeight: 300, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                    <br />
                                                    <b>Average Daily COVID-19 Cases per 100,000</b>
                                                </text>
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
                                                    This figure shows total cases of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are male. US counties were grouped into 5 categories based on the proportion of male residents.
                      We can see that in counties with the highest proportion of male residents (highest 20%), the rate is <b>{(data_index['male']["high20"]['casesdailymean7R']).toFixed(0)}</b> cases per 100,000.
                      In counties with the lowest proportion of male residents (lowest 20%), the rate is <b>{(data_index['male']["low20"]['casesdailymean7R']).toFixed(0)}</b> COVID-19 cases per 100,000.
					          </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 33 }}>
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This figure shows total cases of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are over the age of 65. US counties were grouped into 5 categories based on the proportion of
                      over the age of 65 residents. We can see that in counties with the highest proportion of residents over the age of 65 years (highest 20%),
                      the rate is <b>{(data_index['age65over']["high20"]['casesdailymean7R']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of residents over the age of 65 years (lowest 20%),
                      the rate is <b>{(data_index['age65over']["low20"]['casesdailymean7R']).toFixed(0)}</b> COVID-19 cases per 100,000.
					          </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: '2em' }}>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                COVID-19 cases by percentage of <br />African American population
            		</Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 160, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': data_index['black']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['black']["Q2"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['black']["Q3"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['black']["Q4"]['casesdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': data_index['black']["high20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <text style={{ fontWeight: 300, marginLeft: 100, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                <b>Average Daily COVID-19 Cases per 100,000</b>
                                            </text>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "16pt" }}>
                                            <Header.Content>
                                                COVID-19 cases by percentage of <br />population in poverty
            		</Header.Content>
                                        </Header>
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 160, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': data_index['poverty']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['poverty']["Q2"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['poverty']["Q3"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['poverty']["Q4"]['casesdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': data_index['poverty']["high20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <text style={{ fontWeight: 300, marginLeft: 100, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                <b>Average Daily COVID-19 Cases per 100,000</b>
                                            </text>
                                        </Header.Content>

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid>
                                <Grid.Row columns={2} style={{ paddingBottom: 7 }}>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 132 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total cases of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are African American. US counties were grouped into 5 categories based on the proportion of
                      African American residents. We can see that in counties with the highest proportion of African American residents (highest 20%),
                      the rate is <b>{(data_index['black']["high20"]['casesdailymean7R']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of African American residents (lowest 20%),
                      the rate is <b>{(data_index['black']["low20"]['casesdailymean7R']).toFixed(0)}</b> COVID-19 cases per 100,000.
					          </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 33 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total cases of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are below the federal poverty line. US counties were grouped into 5 categories based on the proportion of
                      residents in poverty. We can see that in counties with the highest proportion of residents in poverty (highest 20%),
                      the rate is <b>{(data_index['poverty']["high20"]['casesdailymean7R']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of residents in poverty (lowest 20%),
                       the rate is <b>{(data_index['poverty']["low20"]['casesdailymean7R']).toFixed(0)}</b> COVID-19 cases per 100,000.
					          </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: '2em' }}>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 cases by percentage of <br />population with diabetes
            		</Header.Content>
                                        </Header>
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 160, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': data_index['diabetes']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['diabetes']["Q2"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['diabetes']["Q3"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['diabetes']["Q4"]['casesdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': data_index['diabetes']["high20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <text style={{ fontWeight: 300, marginLeft: 100, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                <b>Average Daily COVID-19 Cases per 100,000</b>
                                            </text>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 cases by percentage of <br /> Hispanic population
            		</Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 160, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(0))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': data_index['hispanic']["low20"]['casesdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['hispanic']["Q2"]['casesdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['hispanic']["Q3"]['casesdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['hispanic']["Q4"]['casesdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': data_index['hispanic']["high20"]['casesdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <text style={{ fontWeight: 300, marginLeft: 100, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                <b>Average Daily COVID-19 Cases per 100,000</b>
                                            </text>
                                        </Header.Content>

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid>
                                <Grid.Row columns={2} style={{ paddingBottom: 7 }}>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 132 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total cases of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who have diabetes. US counties were grouped into 5 categories based on the proportion of
                      residents with diabetes. We can see that in counties with the highest proportion of residents with diabetes (highest 20%),
                      the rate is <b>{(data_index['diabetes']["high20"]['casesdailymean7R']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of residents with diabetes (lowest 20%),
                      the rate is <b>{(data_index['diabetes']["low20"]['casesdailymean7R']).toFixed(0)}</b> COVID-19 cases per 100,000
					          </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 33 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total cases of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are Hispanic. US counties were grouped into 5 categories based on the proportion of
                      Hispanic residents. We can see that in counties with the highest proportion of Hispanic residents (highest 20%),
                      the rate is <b>{(data_index['hispanic']["high20"]['casesdailymean7R']).toFixed(0)}</b> cases per 100,000. In counties with the lowest proportion of Hispanic residents (lowest 20%),
                      the rate is <b>{(data_index['hispanic']["low20"]['casesdailymean7R']).toFixed(0)}</b> COVID-19 cases per 100,000.
					          </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>


                            <Header as='h2' style={{ textAlign: 'center', color: 'black', fontSize: "18pt", paddingTop: 30 }}>
                                <Header.Content style={{ fontSize: "22pt", color: '#487f84' }}>
                                    <Header.Subheader style={{ color: '#000000', textAlign: 'left', fontSize: "16pt", paddingTop: 16, paddingBottom: 28, paddingLeft: 0, paddingRight: 0 }}>
                                        <center> <b style={{ fontSize: "18pt" }}>COVID-19 deaths per 100,000 across the population characteristics of all the counties in the United States </b> </center>

                                    </Header.Subheader>
                                </Header.Content>
                            </Header>
                            <Grid style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: 50 }}>
                                    <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 deaths by percentage of <br /> male population
                </Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 160, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >

                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': data_index['male']["low20"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['male']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['male']["Q3"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['male']["Q4"]['deathsdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': data_index['male']["high20"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <text style={{ fontWeight: 300, marginLeft: 100, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </text>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: '1em', paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 deaths by percentage of <br />population over the age 65 years
                </Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 160, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "transparent" }, grid: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "transparent" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': data_index['age65over']["low20"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['age65over']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['age65over']["Q3"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['age65over']["Q4"]['deathsdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': data_index['age65over']["high20"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <text style={{ fontWeight: 300, marginLeft: 100, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </text>
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
                                                    This figure shows total deaths of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are male. US counties were grouped into 5 categories based on the proportion of male residents.
                      We can see that in counties with the highest proportion of male residents (highest 20%), the rate is <b>{(data_index['male']["high20"]['deathsdailymean7R']).toFixed(1)}</b> deaths per 100,000.
                      In counties with the lowest proportion of male residents (lowest 20%), the rate is <b>{(data_index['male']["low20"]['deathsdailymean7R']).toFixed(1)}</b> COVID-19 deaths per 100,000.
                    </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontSize: "14pt", lineHeight: "16pt", width: 450, paddingLeft: 33 }}>
                                            <Header.Content style={{ fontSize: "14pt" }}>
                                                <Header.Subheader style={{ color: '#000000', lineHeight: "16pt", width: 450, fontSize: "14pt", textAlign: 'justify' }}>
                                                    This figure shows total deaths of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are over the age of 65. US counties were grouped into 5 categories based on the proportion of
                      over the age of 65 residents. We can see that in counties with the highest proportion of residents over the age of 65 years (highest 20%),
                      the rate is <b>{(data_index['age65over']["high20"]['deathsdailymean7R']).toFixed(2)}</b> deaths per 100,000. In counties with the lowest proportion of residents over the age of 65 years (lowest 20%),
                      the rate is <b>{(data_index['age65over']["low20"]['deathsdailymean7R']).toFixed(2)}</b> COVID-19 deaths per 100,000.
                    </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: '2em' }}>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 deaths by percentage of <br />African American population
                </Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 160, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': data_index['black']["low20"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['black']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['black']["Q3"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['black']["Q4"]['deathsdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': data_index['black']["high20"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <text style={{ fontWeight: 300, marginLeft: 100, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </text>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 deaths by percentage of <br />population in poverty
                </Header.Content>
                                        </Header>
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 160, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': data_index['poverty']["low20"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['poverty']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['poverty']["Q3"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['poverty']["Q4"]['deathsdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': data_index['poverty']["high20"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <text style={{ fontWeight: 300, marginLeft: 100, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </text>
                                        </Header.Content>

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid>
                                <Grid.Row columns={2} style={{ paddingBottom: 7 }}>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 132 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total deaths of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are African American. US counties were grouped into 5 categories based on the proportion of
                      African American residents. We can see that in counties with the highest proportion of African American residents (highest 20%),
                      the rate is <b>{(data_index['black']["high20"]['deathsdailymean7R']).toFixed(2)}</b> deaths per 100,000. In counties with the lowest proportion of African American residents (lowest 20%),
                      the rate is <b>{(data_index['black']["low20"]['deathsdailymean7R']).toFixed(2)}</b> COVID-19 deaths per 100,000.
                    </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 33 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total deaths of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are below the federal poverty line. US counties were grouped into 5 categories based on the proportion of
                      residents in poverty. We can see that in counties with the highest proportion of residents in poverty (highest 20%),
                      the rate is <b>{(data_index['poverty']["high20"]['deathsdailymean7R']).toFixed(2)}</b> deaths per 100,000. In counties with the lowest proportion of residents in poverty (lowest 20%),
                       the rate is <b>{(data_index['poverty']["low20"]['deathsdailymean7R']).toFixed(2)}</b> COVID-19 deaths per 100,000.
                    </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid style={{ paddingLeft: "7em", paddingRight: "7em" }}>
                                <Grid.Row columns={2} style={{ paddingTop: '2em' }}>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 deaths by percentage of <br />population with diabetes
                </Header.Content>
                                        </Header>
                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 160, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(2))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': data_index['diabetes']["low20"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['diabetes']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['diabetes']["Q3"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['diabetes']["Q4"]['deathsdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': data_index['diabetes']["high20"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "20px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <text style={{ fontWeight: 300, marginLeft: 100, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </text>
                                        </Header.Content>

                                    </Grid.Column>
                                    <Grid.Column style={{ paddingTop: 10, paddingBottom: 18 }}>
                                        <Header as='h2' style={{ textAlign: 'center', fontSize: "18pt", lineHeight: "18pt" }}>
                                            <Header.Content>
                                                COVID-19 deaths by percentage of <br /> Hispanic population
                </Header.Content>
                                        </Header>

                                        <VictoryChart
                                            theme={VictoryTheme.material}
                                            width={500}
                                            height={220}
                                            domainPadding={20}
                                            minDomain={{ y: props.ylog ? 1 : 0 }}
                                            padding={{ left: 160, right: 30, top: 30, bottom: -5 }}
                                            style={{ fontSize: "14pt" }}
                                            containerComponent={<VictoryContainer responsive={false} />}
                                        >
                                            <VictoryAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { stroke: "transparent" }, labels: { fill: '#000000', fontSize: "20px" }, tickLabels: { fontSize: "20px", fill: '#000000', fontFamily: 'lato' } }} />
                                            <VictoryAxis dependentAxis style={{ ticks: { stroke: "#FFFFFF" }, axis: { stroke: "#000000" }, grid: { stroke: "transparent" }, axis: { labels: { fill: '#000000' } }, tickLabels: { fontSize: "20px", fill: '#000000', padding: 10, fontFamily: 'lato' } }} />
                                            <VictoryBar
                                                horizontal
                                                barRatio={0.7}
                                                labels={({ datum }) => numberWithCommas(parseFloat(datum.value).toFixed(3))}
                                                data={[
                                                    { key: "Lowest 20%", 'value': data_index['hispanic']["low20"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q2", 'value': data_index['hispanic']["Q2"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q3", 'value': data_index['hispanic']["Q3"]['deathsdailymean7R'] || 0 },
                                                    { key: "Q4", 'value': data_index['hispanic']["Q4"]['deathsdailymean7R'] || 0 },
                                                    { key: "Highest 20%", 'value': data_index['hispanic']["high20"]['deathsdailymean7R'] || 0 }
                                                ]}
                                                labelComponent={<VictoryLabel dx={5} style={{ fontFamily: 'lato', fontSize: "18px", fill: "#000000" }} />}
                                                style={{
                                                    data: {
                                                        fill: "#487f84"
                                                    }
                                                }}
                                                x="key"
                                                y="value"
                                            />
                                        </VictoryChart>

                                        <Header.Content>
                                            <text style={{ fontWeight: 300, marginLeft: 100, paddingBottom: 50, fontSize: "14pt", lineHeight: "18pt" }}>
                                                <b>Average Daily COVID-19 Deaths per 100,000</b>
                                            </text>
                                        </Header.Content>

                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid>
                                <Grid.Row columns={2} style={{ paddingBottom: 7 }}>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 132 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total deaths of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who have diabetes. US counties were grouped into 5 categories based on the proportion of
                      residents with diabetes. We can see that in counties with the highest proportion of residents with diabetes (highest 20%),
                      the rate is <b>{(data_index['diabetes']["high20"]['deathsdailymean7R']).toFixed(2)}</b> deaths per 100,000. In counties with the lowest proportion of residents with diabetes (lowest 20%),
                      the rate is <b>{(data_index['diabetes']["low20"]['deathsdailymean7R']).toFixed(2)}</b> COVID-19 deaths per 100,000
                    </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Header as='h2' style={{ fontWeight: 400, width: 450, paddingLeft: 33 }}>
                                            <Header.Content>
                                                <Header.Subheader style={{ color: '#000000', width: 450, fontSize: "14pt", textAlign: 'justify', lineHeight: "16pt" }}>
                                                    This figure shows total deaths of COVID-19 per 100,000 residents as of {dateCur[stateFips + countyFips].todaydate === 'n/a' ? 'N/A' : (new Date(dateCur[stateFips + countyFips].todaydate * 1000).toLocaleDateString('en-Us', { month: 'short', day: 'numeric', year: 'numeric' }))}.
                      Case rates are shown by proportion of county residents who are Hispanic. US counties were grouped into 5 categories based on the proportion of
                      Hispanic residents. We can see that in counties with the highest proportion of Hispanic residents (highest 20%),
                      the rate is <b>{(data_index['hispanic']["high20"]['deathsdailymean7R']).toFixed(2)}</b> deaths per 100,000. In counties with the lowest proportion of Hispanic residents (lowest 20%),
                      the rate is <b>{(data_index['hispanic']["low20"]['deathsdailymean7R']).toFixed(2)}</b> COVID-19 deaths per 100,000.
                    </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>









                        </div>
                    }
                    <Notes />
                </Container>
                {/* <ReactTooltip>{tooltipContent}</ReactTooltip> */}
                <ReactTooltip > <font size="+2"><b >{countyName}</b> </font> <br />
                    <b>Total Cases</b>: {data[stateFips + countyFips]['casescum'] >= 0 ? data[stateFips + countyFips]['casescum'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths</b>: {data[stateFips + countyFips]['deathscum'] >= 0 ? data[stateFips + countyFips]['deathscum'].toFixed(0) : "N/A"} <br />
                    <b>Total case per 100k</b>: {data[stateFips + countyFips]['casescumR'] >= 0 ? data[stateFips + countyFips]['casescumR'].toFixed(0) : "N/A"} <br />
                    <b>Total Deaths per 100k</b>: {data[stateFips + countyFips]['deathscumR'] >= 0 ? data[stateFips + countyFips]['deathscumR'].toFixed(0) : 'N/A'} <br />
                    <b>Last 14-day Cases per 100k</b>: {data[stateFips + countyFips]['casescum14dayR'] >= 0 ? data[stateFips + countyFips]['casescum14dayR'].toFixed(0) : "N/A"} <br />
                    <b>Click to see county-level data.</b> </ReactTooltip>
            </div>
        );
    } else {
        return <Loader active inline='centered' />
    }




}