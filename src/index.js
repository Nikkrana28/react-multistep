import React, { useState, useEffect } from 'react'
import { css, styled, setup } from 'goober'

setup(React.createElement)
// border-bottom: 2px solid silver;

const Ol = styled('ol')`
  margin: 0;
  padding: 15px 0px;
  list-style-type: none;
  display: flex;
  justify-content: space-between;
`
const Li = styled('li')`
  display: inline-block;
  text-align: center;
  line-height: 4.8rem;
  padding: 0 0.7rem;

  color: silver;
 

  &:hover,
  &:before {
    color: #0FA0CE;
  }
  &:after {
   
  }   
  span {
    padding: 0 1.5rem;
  }
  &:before {
    position: relative;
    float: left;
    left: 50%;
    width: 1.2em;
    line-height: 1.4em;
    border-radius: 0;
    bottom: -3.99rem;
  }
`
const Todo = css`
  &:before {
    
    color: silver;
    background-color: white;
  }
`
const Doing = css`
  &:before {
    
    color: white;
    background-color: #33C3F0;  
  }
`
const Done = css`
  &:before {
    
    color: white;
    background-color: #33C3F0;
  }
`
const New = css`
  border: 1px solid #fff;
  padding: 10px 15px !important;
  border-radius: 50%;
`
const NewActive = css`
  border: 1px solid #d92c2c;
  padding: 10px 15px !important;
  border-radius: 50%;
  color: red;
`
const Newdoing = css`
  border: 1px solid #d92c2c;
  padding: 10px 15px !important;
  border-radius: 50%;
  color: red;
`

const getStep = (defaultIndex, newIndex, length) => {
    if(newIndex <=  length){
        return newIndex;
    }
    return defaultIndex;
  }

const getTopNavStyles = (indx, length) => {
  const styles = []
  for (let i = 0; i < length; i++) {
    if (i < indx) {
      styles.push('done')
    } else if (i === indx) {
      styles.push('doing')
    } else {
      styles.push('todo')
    }
  }
  return styles
}

const getButtonsState = (indx, length) => {
  if (indx > 0 && indx < length - 1) {
    return {
      showPreviousBtn: true,
      showNextBtn: true
    }
  } else if (indx === 0) {
    return {
      showPreviousBtn: false,
      showNextBtn: true
    }
  } else {
    return {
      showPreviousBtn: true,
      showNextBtn: false
    }
  }
}

export default function MultiStep (props) {
  const { activeComponentClassName, inactiveComponentClassName } = props
  const showNav =
    typeof props.showNavigation === 'undefined' ? true : props.showNavigation

  const [activeStep] = useState(getStep(0, props.activeStep,  props.steps.length));
  const [stylesState, setStyles] = useState(getTopNavStyles(activeStep, props.steps.length))
  const [compState, setComp] = useState(activeStep)
  const [buttonsState, setButtons] = useState(getButtonsState(activeStep, props.steps.length))
  
  useEffect(() => {
    console.log('Index changed: ', props.activeStep);
    setStepState(props.activeStep);
  }, [props.activeStep]);
  
  const setStepState = (indx) => {
    setStyles(getTopNavStyles(indx, props.steps.length))
    setComp(indx < props.steps.length ? indx : compState)
    setButtons(getButtonsState(indx, props.steps.length))
  }

  const next = () => {
    setStepState(compState + 1)
    window.FILL = false
  }
  const previous = () => setStepState(compState > 0 ? compState - 1 : compState)

  const handleOnClick = evt => {
    if (
      evt.currentTarget.value === props.steps.length - 1 &&
      compState === props.steps.length - 1
    ) {
      setStepState(props.steps.length)
    } else {
      setStepState(evt.currentTarget.value)
    }
  }

  const renderSteps = () =>
    props.steps.map((s, i) => {
      if (stylesState[i] === 'todo') {
        return (
          <Li
            className={Todo}
            // onClick={handleOnClick}
            key={i}
            value={i}
          >
            <span className={New}>{i + 1}</span>
          </Li>
        )
      } else if (stylesState[i] === 'doing') {
        return (
          <Li
            className={Doing}
            // onClick={handleOnClick}
            key={i}
            value={i}
          >
            <span>{i + 1}</span>
          </Li>
        )
      } else {
        return (
          <Li
            className={Done}
            onClick={handleOnClick}
            key={i}
            value={i}
          >
            <span className={NewActive}>{i + 1}</span>
          </Li>
        )
      }
    })

  const renderNav = () =>
   (
      <div>
        {/* <button
          style={buttonsState.showPreviousBtn ? props.prevStyle : { display: 'none' }}
          onClick={previous}
        >
          Prev
        </button> */}

        <button
          style={props.nextStyle}
          onClick={next}
          disabled={props.fill ? "" : true}
        >
          Next..
        </button>
      </div>
    )

  return (
    <div>
      <Ol>{renderSteps()}</Ol>
      {inactiveComponentClassName
        ? props.steps.map((step, index) => {
            const className = index === compState ? activeComponentClassName : inactiveComponentClassName
            return (<div className={className} key={index}>{step.component}</div>)
          })
        : <div>{props.steps[compState].component}</div>}
      <div>{renderNav(showNav)}</div>
    </div>
  )
}
