import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const loadPurchasedItems = async () => {
    // Obtener los artículos comprados en el mercado mediante la consulta de los eventos ofrecidos con el comprador establecido como usuario
    const filter =  marketplace.filters.Bought(null,null,null,null,null,account)
    const results = await marketplace.queryFilter(filter)
    // Obtener los metadatos de cada nft y añadirlos al objeto listedItem
    const purchases = await Promise.all(results.map(async i => {
      // Obtener los argumentos de cada resultado
      i = i.args
      // Obtener la uri del contrato nft
      const uri = await nft.tokenURI(i.tokenId)
      // Utilizar uri para obtener los metadatos nft almacenados en ipfs 
      const response = await fetch(uri)
      const metadata = await response.json()
      // Obtener el precio total del artículo (precio del artículo + fee)
      const totalPrice = await marketplace.getTotalPrice(i.itemId)
      // Definir el objeto de la lista
      let purchasedItem = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      }
      return purchasedItem
    }))
    setLoading(false)
    setPurchases(purchases)
  }
  useEffect(() => {
    loadPurchasedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Cargando...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No hay compras</h2>
          </main>
        )}
    </div>
  );
}