export default function FloatingContact() {
    const contactInfo = {
        phone: '0876807798',
        zalo: '0876807798',
        facebook: 'https://www.facebook.com/nguyenthanhkai?locale=vi_VN',
        address: 'https://maps.google.com/?q=123+Đường+ABC,+Quận+1,+TP.+Hồ+Chí+Minh'
    };

    const handlePhoneClick = () => {
        window.location.href = `tel:${contactInfo.phone}`;
    };

    const handleZaloClick = () => {
        window.open(`https://zalo.me/${contactInfo.zalo}`, '_blank');
    };

    const handleFacebookClick = () => {
        window.open(contactInfo.facebook, '_blank');
    };

    const handleMapClick = () => {
        window.open(contactInfo.address, '_blank');
    };

    const buttons = [
        {
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                </svg>
            ),
            label: 'Gọi điện',
            color: 'from-green-500 to-green-600',
            hoverColor: 'hover:from-green-600 hover:to-green-700',
            shadowColor: 'shadow-green-500/50',
            onClick: handlePhoneClick,
            type: 'svg'
        },
        {
            icon: '/zalo.jpg',
            label: 'Zalo',
            color: 'from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700',
            shadowColor: 'shadow-blue-500/50',
            onClick: handleZaloClick,
            type: 'image'
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
            ),
            label: 'Bản đồ',
            color: 'from-red-500 to-red-600',
            hoverColor: 'hover:from-red-600 hover:to-red-700',
            shadowColor: 'shadow-red-500/50',
            onClick: handleMapClick,
            type: 'svg'
        },
        {
            icon: '/fb.jpg',
            label: 'Facebook',
            color: 'from-blue-600 to-blue-700',
            hoverColor: 'hover:from-blue-700 hover:to-blue-800',
            shadowColor: 'shadow-blue-600/50',
            onClick: handleFacebookClick,
            type: 'image'
        }
    ];

    return (
        <div className="fixed bottom-24 right-6 z-40">
            <div className="flex flex-col gap-4">
                {buttons.map((button, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-end gap-3 group animate-fadeIn"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Label - appears on hover */}
                        <div className="bg-white px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap transform group-hover:translate-x-0 translate-x-2 border border-gray-200">
                            <span className="text-sm font-bold text-gray-700">{button.label}</span>
                        </div>

                        {/* Button with pulsing animation */}
                        <div className="relative flex-shrink-0">
                            {/* Pulsing ring */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${button.color} rounded-full animate-ping opacity-30`}></div>
                            <div className={`absolute inset-0 bg-gradient-to-br ${button.color} rounded-full animate-pulse opacity-20`}></div>

                            {/* Main button */}
                            <button
                                onClick={button.onClick}
                                className={`relative w-14 h-14 bg-gradient-to-br ${button.color} ${button.hoverColor} text-white rounded-full shadow-lg ${button.shadowColor} hover:shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center overflow-hidden`}
                                aria-label={button.label}
                            >
                                {button.type === 'image' ? (
                                    <img
                                        src={button.icon}
                                        alt={button.label}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    button.icon
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
        </div>
    );
}
