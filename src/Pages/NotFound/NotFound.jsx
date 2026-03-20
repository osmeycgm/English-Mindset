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
          The page you are trying to reach doesn't exist :/</h2>
    </Container>
  );
};
export default NotFound;
