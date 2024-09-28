
import '../../public/plugins/fontawesome-free/css/all.min.css';
import '../../public/dist/css/adminlte.min.css';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
export default function DashboardLayout(
    {
  children, 
}: Readonly<{
  children: React.ReactNode;
}>
) {
  return (
    <>
      <div className="hold-transition sidebar-mini layout-fixed">
        <div className="wrapper">
            <Navbar/>
            <Sidebar/>
          <div className="content-wrapper">
                <section className="content">
                    <div className="container-fluid">
                    {children}  {/* This will display the content of the current page */}
                </div>
                </section>
          </div>
        </div>
      </div>
    </>
  ); 
}
