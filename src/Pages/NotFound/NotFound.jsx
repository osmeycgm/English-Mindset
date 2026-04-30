import { Container } from "react-bootstrap";

const NotFound = () => {
  return (
    <Container className="pt-5" style={{ 
      minHeight: "100vh",
      display: "flex",   
    alignItems: "center"}}>
      <h2 className="mb-4" style={{
        textAlign:"center", 
        alignItems:"center"}}>
          Lo siento, la página que buscas no existe. :/</h2>
    </Container>
  );
};
export default NotFound;
