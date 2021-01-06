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
                                                COVID-19 Community Vulnerability Index can be found <a href="https://precisionforcovid.org/ccvi">here</a>.

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
                                                        <text x={20} y={50} style={{ fontSize: '0.8em' }}>Least vulnerable</text>
                                                        <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest vulnerable</text>
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
                                                <div id='urbanrural' style={{ width: "100%", height: "100%" }}>
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
                                                <div id='poverty' style={{ width: "100%", height: "100%" }}>
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
                                                        <text x={20} y={50} style={{ fontSize: '0.8em' }}>Least vulnerable</text>
                                                        <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest vulnerable</text>
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
                                                <div id='black' style={{ width: "100%", height: "100%" }}>
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
                                                        <text x={20} y={50} style={{ fontSize: '0.8em' }}>Least vulnerable</text>
                                                        <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest vulnerable</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>counties</text>
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
                                                <div id='hispanic' style={{ width: "100%", height: "100%" }}>
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
                                                        <text x={20} y={50} style={{ fontSize: '0.8em' }}>Least vulnerable</text>
                                                        <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest vulnerable</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>counties</text>
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
                                                <div id='diabetes' style={{ width: "100%", height: "100%" }}>
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
                                                        <text x={20} y={50} style={{ fontSize: '0.8em' }}>Least vulnerable</text>
                                                        <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest vulnerable</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={59} style={{ fontSize: '0.8em' }}>counties</text>
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
                                                <div id='age' style={{ width: "100%", height: "100%" }}>
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
                                                        <text x={20} y={50} style={{ fontSize: '0.8em' }}>Least vulnerable</text>
                                                        <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest vulnerable</text>
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
                                                <div id='male' style={{ width: "100%", height: "100%" }}>
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
                                                        <text x={20} y={50} style={{ fontSize: '0.8em' }}>Least vulnerable</text>
                                                        <text x={20} y={59} style={{ fontSize: '0.8em' }}>counties</text>
                                                        <text x={160 + 40 * (colorPalette2.length - 1)} y={50} style={{ fontSize: '0.8em' }}>Highest vulnerable</text>
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