import './App.css';
import UserDashboard from './UserComponents/UserDashboard';
import AdminDashboard from './AdminComponents/AdminDashboard';
import OtherCompanyDashboard from './OtherCompanyComponents/OtherCompanyDashboard';
import DeliveryBoyDashboard from './DeliveryBoyComponents/DeliveryBoyDashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Register from './Register';
import Login from './Login';
import Home from './Home';
import ManageUserRequests from './AdminComponents/ManageUserRequests';
import ManagePickups from './AdminComponents/ManagePickups';
import BidStocks from './AdminComponents/BidStocks';
import FinancialTransactions from './AdminComponents/FinancialTransactions';
import UpdatedPasswordForAdmin from './AdminComponents/UpdatedPasswordForAdmin';
import UpdatedPasswordForDeliveryBoy from './DeliveryBoyComponents/UpdatedPasswordForDeliveryBoy';
import UpdatedPasswordForUser from './UserComponents/UpdatedPasswordForUser';
import UpdatePasswordForOtherCompany from './OtherCompanyComponents/UpdatePasswordForOtherCompany';
import EWsteRequest from './UserComponents/EWsteRequest';
import ViewRequest from './UserComponents/ViewRequest';
import ManagePickupsForDeliveryBoy from './DeliveryBoyComponents/ManagePickupsForDeliveryBoy';
import CompletedPickups from './DeliveryBoyComponents/ComplectedPickups';
import ViewPaidRequest from './UserComponents/ViewPaidRequest';
import ManageBidding from './OtherCompanyComponents/ManageBidding';
import ManageDeliveryBoys from './AdminComponents/ManageDeliveryBoys';



export const baseUrl = "http://localhost:8080"; 


function App() {
  return (
   <>

<div className="App">
     <BrowserRouter>
     <ToastContainer />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reg" element={<Register />} /> 
                
             
                <Route path="/adminDashboard" element={<AdminDashboard />}>

                <Route path="ManageUserRequests" element={<ManageUserRequests />} />
                <Route path="ManagePickups" element={<ManagePickups />} />
                <Route path="BidStocks" element={<BidStocks />} /> 
                <Route path="FinancialTransactions" element={<FinancialTransactions />} />
                <Route path="ManageDeliveryBoys" element={<ManageDeliveryBoys />} />
                <Route path="UpdatedPasswordForAdmin" element={<UpdatedPasswordForAdmin />} />  

                </Route>




                 <Route path="/deliveryBoyDashboard" element={<DeliveryBoyDashboard />}>

                <Route path="ManagePickupsForDeliveryBoy" element={<ManagePickupsForDeliveryBoy />} />
                <Route path="CompletedPickups" element={<CompletedPickups />} />
                {/* <Route path="ViewFeedback" element={<ViewFeedback />} /> */}
                <Route path="UpdatedPasswordForDeliveryBoy" element={<UpdatedPasswordForDeliveryBoy />} />
        
                      </Route>




                  <Route path="/otherCompanyDashboard" element={<OtherCompanyDashboard />}>


                  <Route path="ManageBidding" element={<ManageBidding />} />
                  <Route path="UpdatedPasswordForOtherCompany" element={<UpdatePasswordForOtherCompany />} />

                  </Route>
                
          
                
              
                <Route path="/userDashboard" element={<UserDashboard />}>

                <Route path="EWsteRequest" element={<EWsteRequest />} />
                <Route path="ViewRequest" element={<ViewRequest />} />
                <Route path="ViewPaidRequest" element={<ViewPaidRequest />} />
                <Route path="UpdatedPasswordForUser" element={<UpdatedPasswordForUser />} />
               

                   
                </Route>
                
            </Routes>
            </BrowserRouter>
    </div>

   </>
  );
}

export default App;
