import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Container,
  Row,
  Col,
  Card,
  ButtonGroup,
  Button,
  Alert,
} from 'react-bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import { formatDate, formatMoney } from './lib/index'

function App() {
  const [data, setData] = useState([])
  const [sortType, setSortType] = useState(['price'])
  const  [newSort , setNewSort] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [isEndofLine, setIsEndofLine] = useState(false)
  let count = 0

  useEffect(() => {
    getData(currentPage)
    window.addEventListener('scroll', fetchScrollDown)
    return () => window.removeEventListener('scroll', fetchScrollDown)
  }, [])

  useEffect(() => {
    if (!isFetching) return
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching])

  const getData = async (page) => {
    try {
      console.log("getting data");
      setIsLoading(true)

      if (!page) {
        page = currentPage
      }

      console.log("getData:",sortType);
      let url =   `http://localhost:8000/products?`;
      if (newSort){
        url = url + `_page=0&_limit=15&_sort=${sortType}`;
      }else{
        url = url + `_page=${page}&_limit=15&_sort=${sortType}`;

      }

      console.log(url);
      const result = await axios.get(
        url,
      )

      if (!result.data.length) {
        setIsEndofLine(true)
        setIsFetching(false)
        return
      }
      console.log(result.data);
      
      if (newSort){
        console.log("new sort");
        setData(result.data)
        setNewSort(false);
      }else{
        setData([...data, ...result.data])
      }

      let newPage = currentPage
      newPage++
      setCurrentPage(newPage)

      setIsFetching(false)
      console.log('Data Size', result.data.length)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log("sorty type useeffect:",sortType);
    setData([])
    setNewSort(true);
    console.log("Sort Type:",sortType);
    getData(0)

  }, [sortType])

  
const reSort = async  (sortOrder) => {
      console.log('Sort Order called')
      console.log("newSort",newSort);
      setData([])
      let sortVar = sortType;
      sortVar = sortOrder;
      setSortType(sortVar)
     // setNewSort(true);
     // console.log("Sort Type:",sortType);
     // getData(0)
      //setIsLoading(false)
   

}

  const fetchScrollDown = async () => {
    const innetScrollTop =
      window.innerHeight + document.documentElement.scrollTop + 1
    const offset = document.documentElement.offsetHeight

    if (innetScrollTop >= offset && !isEndofLine) {
      setIsFetching(true)
    } else {
      return
    }
  }

  return (
    <div className="App">
      <Container>
        <div>Sort Order</div>
        <ButtonGroup style={{ padding: '10px' }} size="sm">
          <Button
            onClick={() => {
              reSort('size')
            }}
          >
            Size
          </Button>
          <Button
            onClick={() => {
              reSort('price')
            }}
          >
            Price
          </Button>
          <Button
            onClick={() => {
              reSort('id')
            }}
          >
            Id
          </Button>
        </ButtonGroup>

        <Row></Row>

        <Row xs={1} md={5} className="g-4">
          {data.map((d) => {
            count++
            return (
              <>
                {count % 20 === 0 ? (
                  <Col>
                    <Card>
                      <Card.Img
                        variant="top"
                        src={`http://localhost:8000/ads/?r=${Math.floor(
                          Math.random() * 1000 + count,
                        )}`}
                      />
                      <Card.Body>
                        <Card.Title>
                          But first, A word from our sponsors
                        </Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                ) : null}

                <Col>
                  <Card>
                    <Card.Header style={{ fontSize: `${d.size}px` }}>
                      {d.face}
                    </Card.Header>
                    <Card.Body>
                      <Card.Title>ID: {d.id}</Card.Title>
                      <Card.Text>Size: {d.size}</Card.Text>
                      <Card.Text>Price: {formatMoney(d.price)}</Card.Text>
                      <Card.Text>Date: {formatDate(d.date)}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            )
          })}
        </Row>
        <Row>
          {isLoading ? (
            <Alert style={{ marginTop: 20 }} variant="primary">
              {isEndofLine ? '~ end of catalogue ~' : 'loading...'}
            </Alert>
          ) : null}
        </Row>
      </Container>
    </div>
  )
}

export default App
