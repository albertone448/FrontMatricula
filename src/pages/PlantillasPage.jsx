import Header from "../components/common/Header";
import ConnectedAccounts from "../components/plantillas/ConnectedAccounts";
import DangerZone from "../components/plantillas/DangerZone";
import Notifications from "../components/plantillas/Notifications";
import Profile from "../components/plantillas/Profile";
import Security from "../components/plantillas/Security";
import { motion } from "framer-motion";
import SalesByCategoryChart from "../components/plantillas/SalesByCategoryChart";
import DailySalesTrend from "../components/plantillas/DailySalesTrend";
import SalesOverviewChart from "../components/plantillas/SalesOverviewChart";
import { BarChart2, Users, Zap, CreditCard, AlertTriangle, DollarSign, Package, ShoppingCart, TrendingUp, UserCheck, UserPlus, UsersIcon, UserX, CheckCircle, Clock, ShoppingBag } from "lucide-react";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/plantillas/UsersTable";
import UserGrowthChart from "../components/plantillas/UserGrowthChart";
import UserActivityHeatmap from "../components/plantillas/UserActivityHeatmap";
import UserDemographicsChart from "../components/plantillas/UserDemographicsChart";
import OverviewCards from "../components/plantillas/OverviewCards";
import RevenueChart from "../components/plantillas/RevenueChart";
import ChannelPerformance from "../components/plantillas/ChannelPerformance";
import ProductPerformance from "../components/plantillas/ProductPerformance";
import UserRetention from "../components/plantillas/UserRetention";
import CustomerSegmentation from "../components/plantillas/CustomerSegmentation";
import AIPoweredInsights from "../components/plantillas/AIPoweredInsights";
import DailyOrders from "../components/plantillas/DailyOrders";
import OrderDistribution from "../components/plantillas/OrderDistribution";
import OrdersTable from "../components/plantillas/OrdersTable";
import CategoryDistributionChart from "../components/plantillas/CategoryDistributionChart";
import SalesChannelChart from "../components/plantillas/SalesChannelChart";
import SalesTrendChart from "../components/plantillas/SalesTrendChart";
import ProductsTable from "../components/plantillas/ProductsTable";

const orderStats = {
	totalOrders: "1,234",
	pendingOrders: "56",
	completedOrders: "1,178",
	totalRevenue: "$98,765",
};

const salesStats = {
	totalRevenue: "$1,234,567",
	averageOrderValue: "$78.90",
	conversionRate: "3.45%",
	salesGrowth: "12.3%",
};

const userStats = {
	totalUsers: 152845,
	newUsersToday: 243,
	activeUsers: 98520,
	churnRate: "2.4%",
};

const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title='Plantillas' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<Profile />
				<Notifications />
				<Security />
				<ConnectedAccounts />
				<DangerZone />
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Revenue' icon={DollarSign} value={salesStats.totalRevenue} color='#6366F1' />
					<StatCard
						name='Avg. Order Value'
						icon={ShoppingCart}
						value={salesStats.averageOrderValue}
						color='#10B981'
					/>
					<StatCard
						name='Conversion Rate'
						icon={TrendingUp}
						value={salesStats.conversionRate}
						color='#F59E0B'
					/>
					<StatCard name='Sales Growth' icon={CreditCard} value={salesStats.salesGrowth} color='#EF4444' />
				</motion.div>

				<SalesOverviewChart />

				<SalesByCategoryChart />
				<DailySalesTrend />
				<StatCard
						name='Total Users'
						icon={UsersIcon}
						value={userStats.totalUsers.toLocaleString()}
						color='#6366F1'
					/>
				<StatCard name='New Users Today' icon={UserPlus} value={userStats.newUsersToday} color='#10B981' />
				<StatCard
						name='Active Users'
						icon={UserCheck}
						value={userStats.activeUsers.toLocaleString()}
						color='#F59E0B'
					/>
				<StatCard name='Churn Rate' icon={UserX} value={userStats.churnRate} color='#EF4444' />

				<UsersTable />
				<UserGrowthChart />
				<UserActivityHeatmap />
				<UserDemographicsChart />
				<OverviewCards />
				<RevenueChart />
				<ChannelPerformance />
				<ProductPerformance />
				<UserRetention />
				<CustomerSegmentation />
				<AIPoweredInsights />
				<StatCard name='Total Orders' icon={ShoppingBag} value={orderStats.totalOrders} color='#6366F1' />
				<StatCard name='Pending Orders' icon={Clock} value={orderStats.pendingOrders} color='#F59E0B' />
				<StatCard
					name='Completed Orders'
					icon={CheckCircle}
					value={orderStats.completedOrders}
					color='#10B981'
				/>
				<StatCard name='Total Revenue' icon={DollarSign} value={orderStats.totalRevenue} color='#EF4444' />

				<DailyOrders />
				<OrderDistribution />

				<OrdersTable />
				<StatCard name='Total Sales' icon={Zap} value='$12,345' color='#6366F1' />
				<StatCard name='New Users' icon={Users} value='1,234' color='#8B5CF6' />
				<StatCard name='Total Products' icon={ShoppingBag} value='567' color='#EC4899' />
				<StatCard name='Conversion Rate' icon={BarChart2} value='12.5%' color='#10B981' />

				<SalesOverviewChart />
				<CategoryDistributionChart />
				<SalesChannelChart />
				<StatCard name='Total Products' icon={Package} value={1234} color='#6366F1' />
				<StatCard name='Top Selling' icon={TrendingUp} value={89} color='#10B981' />
				<StatCard name='Low Stock' icon={AlertTriangle} value={23} color='#F59E0B' />
				<StatCard name='Total Revenue' icon={DollarSign} value={"$543,210"} color='#EF4444' />

				<ProductsTable />
				<SalesTrendChart />
				<CategoryDistributionChart />
			</main>
		</div>
	);
};
export default SettingsPage;
