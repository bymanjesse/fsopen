import React from 'react'

const Header = (props) => {
  return (
    <h1>{props.course.name}</h1>
  )
}

const Part = (props) => {
  return (
    <p>{props.part.name} {props.part.exercises}</p>
  )
}

const Content = (props) => {
  return (
    <>
      {props.course.parts.map(part => <Part key={part.name} part={part} />)}
    </>
  )
}

const Course = (props) => {
  return (
    <>
      <Header course={props.course} />
      <Content course={props.course} />
    </>
  )
}

export default Course