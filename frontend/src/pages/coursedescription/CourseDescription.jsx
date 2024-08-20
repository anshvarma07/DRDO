import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { fetchUser } = UserData();

  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, []);
  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
  
    try {
      const { data: { order } } = await axios.post(
        `${server}/api/course/checkout/${params.id}`,
        {},
        {
          headers: {
            token,
          },
        }
      );
  
      if (order) {
        console.log("Order received:", order);
        console.log(order.id);
  
        const options = {
          key: "rzp_test_DWMqmVUZmnhIWh", // Enter the Key ID generated from the Dashboard
          amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          currency: "INR",
          name: "DRDO", // your business name
          description: "Learn with us",
          order_id: order.id, // Order ID obtained from the response
  
          handler: async function (response) {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
              response;
  
            try {
              const { data } = await axios.post(
                `${server}/api/verification/${params.id}`,
                {
                  razorpay_order_id,
                  razorpay_payment_id,
                  razorpay_signature,
                },
                {
                  headers: {
                    token,
                  },
                }
              ).catch(err => {
                console.log("Verification error");
              });
  
              await fetchUser();
              await fetchCourses();
              await fetchMyCourse();
              toast.success(data.message);
              setLoading(false);
              navigate(`/payment-success/${razorpay_payment_id}`);
            } catch (error) {
              toast.error(error.response.data.message);
              setLoading(false);
            }
          },
          theme: {
            color: "#204282",
          },
        };
  
        const razorpay = new Razorpay(options);
        razorpay.open();
      } else {
        console.log("Order is undefined or empty");
        setLoading(false);
      }
    } catch (err) {
      console.log("Checkout error", err);
      setLoading(false); // Ensure loading is turned off in case of error
    }
  };
  

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {course && (
            <div className="course-description">
              <div className="course-header">
                <img
                  src={`${server}/${course.image}`}
                  alt=""
                  className="course-image"
                />
                <div className="course-info">
                  <h2>{course.title}</h2>
                  <p>Instructor: {course.createdBy}</p>
                  <p>Duration: {course.duration} weeks</p>
                </div>
              </div>

              <p>{course.description}</p>

              <p>Let's get started with course At ₹{course.price}</p>

              {user && user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button onClick={checkoutHandler} className="common-btn">
                  Buy Now
                </button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseDescription;
