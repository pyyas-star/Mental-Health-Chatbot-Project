import Button from './Button'

const Main = () => {
    return (
        <>
            <div className='container my-5'>
                <div className='p-5 text-center rounded' style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white'
                }}>
                    <h1 style={{ fontSize: '48px', fontWeight: '700', marginBottom: '24px' }}>
                        💭 Mental Health Companion
                    </h1>
                    <p className='lead' style={{ fontSize: '20px', marginBottom: '16px' }}>
                        Welcome to your comprehensive AI-powered mental health companion. Share your thoughts and feelings 
                        in a safe, supportive environment powered by advanced sentiment analysis and personalized wellness tools.
                    </p>
                    <p className='lead' style={{ fontSize: '18px', marginBottom: '16px' }}>
                        Our intelligent chatbot uses state-of-the-art DistilBERT emotion detection to understand your emotional 
                        state and provide personalized, compassionate responses. Whether you're feeling happy, sad, anxious, or 
                        anything in between, we're here to listen and support you on your mental wellness journey.
                    </p>
                    
                    <div className='d-flex justify-content-center gap-3'>
                        <Button text="Get Started" class='btn-light' url="/dashboard" />
                        <Button text="Learn More" class='btn-outline-light' url="/register" />
                    </div>
                    
                    <div className='mt-5 pt-4' style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                        <h3 style={{ fontSize: '28px', marginBottom: '24px', fontWeight: '600' }}>Comprehensive Wellness Features</h3>
                        <div className='row mt-4'>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤖</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>AI-Powered Chat</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Advanced emotion detection using DistilBERT transformer models to understand and respond to your feelings
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Mood History</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Comprehensive history and statistics to track your emotional journey over time
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Daily Check-ins</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Quick daily mood check-ins with calendar view to maintain consistent self-awareness
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Goal Tracking</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Set and track personal wellness goals with progress visualization and completion celebrations
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🙏</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Gratitude Journal</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Daily gratitude entries with streak tracking to cultivate positive mindset
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧘</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Breathing Exercises</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Guided breathing exercises with visual animations to help manage stress and anxiety
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>💡</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Wellness Tips</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Personalized wellness tips and resources based on your current emotional state
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏰</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Smart Reminders</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Customizable daily reminders and browser notifications to maintain your wellness routine
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Private & Secure</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Your conversations and data are private, encrypted, and securely stored
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='mt-4 text-center text-muted'>
                    <small>
                        <strong>Note:</strong> This chatbot is designed to provide emotional support and is not a replacement 
                        for professional mental health services. If you're experiencing a crisis, please contact a mental 
                        health professional or emergency services.
                    </small>
                </div>
            </div>
        </>
    )
}

export default Main

                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Guided breathing exercises with visual animations to help manage stress and anxiety
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>💡</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Wellness Tips</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Personalized wellness tips and resources based on your current emotional state
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏰</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Smart Reminders</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Customizable daily reminders and browser notifications to maintain your wellness routine
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Private & Secure</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Your conversations and data are private, encrypted, and securely stored
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='mt-4 text-center text-muted'>
                    <small>
                        <strong>Note:</strong> This chatbot is designed to provide emotional support and is not a replacement 
                        for professional mental health services. If you're experiencing a crisis, please contact a mental 
                        health professional or emergency services.
                    </small>
                </div>
            </div>
        </>
    )
}

export default Main

                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Guided breathing exercises with visual animations to help manage stress and anxiety
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>💡</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Wellness Tips</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Personalized wellness tips and resources based on your current emotional state
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏰</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Smart Reminders</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Customizable daily reminders and browser notifications to maintain your wellness routine
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Private & Secure</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Your conversations and data are private, encrypted, and securely stored
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='mt-4 text-center text-muted'>
                    <small>
                        <strong>Note:</strong> This chatbot is designed to provide emotional support and is not a replacement 
                        for professional mental health services. If you're experiencing a crisis, please contact a mental 
                        health professional or emergency services.
                    </small>
                </div>
            </div>
        </>
    )
}

export default Main

                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Guided breathing exercises with visual animations to help manage stress and anxiety
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>💡</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Wellness Tips</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Personalized wellness tips and resources based on your current emotional state
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>⏰</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Smart Reminders</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Customizable daily reminders and browser notifications to maintain your wellness routine
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4 col-sm-6 mb-4'>
                                <div className='p-3 h-100' style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px' }}>
                                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
                                    <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>Private & Secure</h5>
                                    <p style={{ fontSize: '14px', opacity: '0.9', lineHeight: '1.6' }}>
                                        Your conversations and data are private, encrypted, and securely stored
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='mt-4 text-center text-muted'>
                    <small>
                        <strong>Note:</strong> This chatbot is designed to provide emotional support and is not a replacement 
                        for professional mental health services. If you're experiencing a crisis, please contact a mental 
                        health professional or emergency services.
                    </small>
                </div>
            </div>
        </>
    )
}

export default Main
