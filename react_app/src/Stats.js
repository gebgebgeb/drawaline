import React from 'react';

import styles from './styles'

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

function mean(data){
	if(data.length === 0){
		return 0
	}
	let sum = 0
	for(let x of data){
		sum += x
	}
	return(sum/data.length)
}

function minN(data, n, accessor){
	return data.sort((x,y)=>(accessor(x)>accessor(y))).slice(0, n)
}


function Stats(props){
	let stats = { 
		attemptsToday: {value: 0, desc: 'Attempts today', decimals: 0}
		, attemptsMonth: {value: 0, desc: 'Attempts this month', decimals: 0}
		, attemptsAllTime: {value: 0, desc: 'Attempts all time', decimals: 0}
		, averageToday : {value: 0, desc: 'Average today', decimals: 1}
		, bestToday : {value: 0, desc: 'Best today', decimals: 1}
		, averageLast10 : {value: 0, desc: 'Average last 10', decimals: 1}
		, averageTop10Month : {value: 0, desc: 'Average of top 10 this month', decimals: 1}
		, averageTop10AllTime : {value: 0, desc: 'Average of top 10 all time', decimals: 1}
	}
	if(props.allScores){
		if(props.curTemplate){
			let templateScores = props.allScores.filter(x => (x.template === props.curTemplate.dirname))
			if(templateScores.length){
				// today
				let now = new Date()
				let monthScores = templateScores.filter((x)=>{
					let scoreDate = new Date(x.date);
					return(
						now.getFullYear() === scoreDate.getFullYear() 
						&& now.getMonth() === scoreDate.getMonth()
					)
				})
				let todayScores = monthScores.filter((x)=>{
					let scoreDate = new Date(x.date);
					return(
						now.getDate() === scoreDate.getDate()
					)
				})
				stats.averageToday.value = mean(todayScores.map(x=>x.score))
				stats.bestToday.value = Math.min(...todayScores.map(x=>x.score))

				stats.averageTop10Month.value = mean(minN(monthScores, 10, x=>x.score).map(x=>x.score))
				stats.averageTop10AllTime.value = mean(minN(templateScores, 10, x=>x.score).map(x=>x.score))

				let last10Scores = templateScores.slice(0, 10)
				stats.averageLast10.value = mean(last10Scores.map(x=>x.score))

				stats.attemptsToday.value = todayScores.length ? todayScores.length : 0
				stats.attemptsMonth.value = monthScores.length ? monthScores.length : 0
				stats.attemptsAllTime.value = templateScores.length ? templateScores.length : 0
			}
		}
	}
	
	let orderedStats = ['attemptsToday', 'attemptsMonth', 'attemptsAllTime'
		, 'averageToday', 'bestToday', 'averageLast10'
		, 'averageTop10Month', 'averageTop10AllTime']
	let statItems = orderedStats.map((key)=>(
		<ListItem key={key}>
			<Typography >
				{stats[key].desc}: {stats[key].value.toFixed(stats[key].decimals)}
		 </Typography>
		</ListItem>
	))
	return(
		<div>
			<List>
				<ListItem>
					<Typography variant="h6">
						Score: {props.lastScore.toFixed(1)}
					</Typography>
				</ListItem>
				{statItems}
				<ListItem>
					<Button color="primary"
						variant='outlined'
						onClick={props.clearAllHistory}
					>
						Clear All History
					</Button>
				</ListItem>
				<ListItem>
					<Button color="primary"
						variant='outlined'
						onClick={props.clearThisHistory}
					>
						Clear Template History
					</Button>
				</ListItem>

			</List>
		</div>
	)
}

export default withStyles(styles)(Stats);
